import * as React from 'react'
import { forEach } from 'lodash';
import Link from 'gatsby-link'
import { AuthorListDisplay, AuthorDisplay } from './authors';
import { StaticQuery, useStaticQuery, graphql } from 'gatsby';

import { StrapiAuthorGroupConnection, StrapiPublicationGroupConnection, StrapiPublication, StrapiVenueGroupConnection, StrapiVenue, StrapiVenueConnection, StrapiPublicationVenue_Year, StrapiPublicationAuthors, StrapiAuthor } from '../../graphql-types';

import '@fortawesome/fontawesome-free/scss/fontawesome.scss';
import '@fortawesome/fontawesome-free/scss/solid.scss';

const venuesQuery = graphql`query venues {
        allStrapiVenue {
            nodes {
                id,
                strapiId
                long_name
                short_name
                type
            }
        }
    }`;

interface PublicationListDisplayProps {
    groupByVenue: boolean;
    data: ReadonlyArray<StrapiPublication>
    backTo?: number
    highlightAuthors?: number[]
}

export class PublicationListDisplay extends React.Component<PublicationListDisplayProps, {}> {
    constructor(props: PublicationListDisplayProps, context: {}) {
        super(props, context)
    }
    public render(): JSX.Element {
        return <StaticQuery query={venuesQuery}
                render={venuesData => <PublicationListDisplayWithVenues highlightAuthors={this.props.highlightAuthors} backTo={this.props.backTo} groupByVenue={this.props.groupByVenue} data={this.props.data} venues={venuesData.allStrapiVenue} />} />;
    }
}

interface PublicationListDisplayWithVenuesProps extends PublicationListDisplayProps{
    venues: StrapiVenueGroupConnection;
}
class PublicationListDisplayWithVenues extends React.Component<PublicationListDisplayWithVenuesProps, {}> {
    constructor(props: PublicationListDisplayWithVenuesProps, context: {}) {
        super(props, context)
    }
    public render() {
        const { data, groupByVenue, venues, backTo } = this.props;
        const venuePubs: Map<number, StrapiPublication[]> = new Map();
        const idToVenueYear: Map<number, StrapiPublicationVenue_Year> = new Map();
        const venueTimes: Map<number, number> = new Map();
        data.forEach((pub) => {
            const { venue_year } = pub;
            if(!backTo || venue_year.year >= backTo) {
                const vyid = venue_year ? venue_year.id : -1;
                if(venuePubs.has(vyid)) {
                    venuePubs.get(vyid).push(pub);
                } else {
                    venuePubs.set(vyid, [pub]);
                    idToVenueYear.set(vyid, venue_year);
                }

                if(venue_year) {
                    venueTimes.set(vyid, new Date(venue_year.conference_start).getTime());
                }
            }
        });
        const vyOrder = Array.from(venuePubs.keys()).sort((a, b) => {
            const aVenueTime = venueTimes.has(a) ? venueTimes.get(a) : -1;
            const bVenueTime = venueTimes.has(b) ? venueTimes.get(b) : -1;
            return bVenueTime - aVenueTime;
        });
        if(groupByVenue) {
            const vyDisplays: (JSX.Element|string)[] = vyOrder.map((vyid: number) => {
                let venueString: string;
                const venueYear = idToVenueYear.get(vyid);
                if(venueYear) {
                    const venue = findVenue(venueYear.venue, venues.nodes);
                    if(venue) {
                        venueString = `${venue.short_name} ${venueYear.year}`;
                    } else {
                        venueString = `...${venueYear.year}`;
                    }
                } else {
                    venueString = `...`;
                }

                const pubDisplays = venuePubs.get(vyid).map((pub) => {
                    return <li key={pub.id}><PublicationSummaryWithVenuesDisplay data={pub} venues={venues} /></li>;
                });

                const venueDisplay = venueYear.homepage ?
                    <span className="venue"><a href={venueYear.homepage} target='_blank'>{venueString}</a></span> :
                    <span className="venue">{venueString}</span>;

                return <li key={vyid}>
                    {venueDisplay}
                    <ul>{pubDisplays}</ul>
                </li>;
            });

            return <ul className="publication-list">
                {vyDisplays}
            </ul>;
        } else {
            const pubDisplays: JSX.Element[] = [];
            vyOrder.forEach((vyid: number) => {
                venuePubs.get(vyid).forEach((pub) => {
                    pubDisplays.push(<li key={pub.id}><PublicationSummaryWithVenuesDisplay highlightAuthors={this.props.highlightAuthors} data={pub} venues={venues} /></li>);
                });
            });

            return <ul className="publication-list">{pubDisplays}</ul>;
        }
    }
}

export function findVenue(id: number, data: ReadonlyArray<StrapiVenue>): StrapiVenue|null {
    for(let i: number = 0; i<data.length; i++) {
        if(id === data[i].strapiId) {
            return data[i];
        }
    }
    return  null;
}
    
interface PublicationSummaryDisplayProps {
    data: StrapiPublication
    highlightAuthors?: number[]
}

export class PublicationSummaryDisplay extends React.Component<PublicationSummaryDisplayProps, {}> {
    constructor(props: PublicationSummaryDisplayProps, context: {}) {
        super(props, context)
    }

    public render(): JSX.Element {
        return <StaticQuery query={venuesQuery}
                render={venuesData => <PublicationSummaryWithVenuesDisplay data={this.props.data} venues={venuesData.allStrapiVenue} highlightAuthors={this.props.highlightAuthors} />} />;
    }
}
interface PublicationSummaryDisplayWithVenuesProps extends PublicationSummaryDisplayProps {
    venues: StrapiVenueGroupConnection;
}

export class PublicationSummaryWithVenuesDisplay extends React.Component<PublicationSummaryDisplayWithVenuesProps, {}> {
    constructor(props: PublicationSummaryDisplayWithVenuesProps, context: {}) {
        super(props, context)
    }
    public render(): JSX.Element {
        const { data, venues } = this.props;
        const authors = Array.from(data.authors) as any as StrapiAuthor[];
        const venue = findVenue(data.venue_year.venue, venues.nodes);
        let venue_short_name: string;
        if(venue) {
            venue_short_name = `${venue.short_name} ${data.venue_year.year}`;
        } else {
            venue_short_name = `${data.venue_year.year}`;
        }

        let venue_date_range: string = `(${data.venue_year.year})`;
        // if(data.venue_year.conference_start && data.venue_year.conference_end) {
            // const conference_start = new Date(data.venue_year.conference_start);
            // const conference_end = new Date(data.venue_year.conference_end);
            // venue_date_range = `${getDateRangeString(conference_start, conference_end)} (${data.venue_year.year})`;
        // }
        const downloadName = getDownloadName(data, venues.nodes);
        // const pdfDownload = data.pdf ? <a href={data.pdf.publicURL} download={downloadName}>PDF</a> : null;

        return <div className="paper row">
            <div className="col-sm-10">
                <Link className="paper-title" to={`/p/${downloadName}`}>{data.title}</Link>
                <div className="paper-authors"><AuthorListDisplay authors={authors} withLinks={true} highlightAuthors={this.props.highlightAuthors} /></div>
                <p className="paper-description">{data.short_description}</p>
            </div>
            <div className="col-sm-2 text-left">
                <div className="paper-venue">{venue_short_name}</div>
                <div className="paper-award"><AwardDisplay data={data.award} description={data.award_description} /></div>
            </div>
        </div>;
    }
}

enum AwardType {
    best_paper,
    honorable_mention,
    none
};
interface AwardDisplayProps {
    data: string|null,
    description: string|null
}
export class AwardDisplay extends React.Component<AwardDisplayProps, {}> {
    private type: AwardType;
    private description: string;
    constructor(props: AwardDisplayProps, context: {}) {
        super(props, context)
        if(this.props.data === 'best_paper') {
            this.type = AwardType.best_paper;
            this.description = this.props.description ? this.props.description : 'Best Paper';
        } else if(this.props.data === 'honorable_mention') {
            this.type = AwardType.honorable_mention;
            this.description = this.props.description ? this.props.description : 'Honorable Mention';
        } else {
            this.type = AwardType.none;
            this.description = this.props.description ? this.props.description : '';
        }
    }
    public render():JSX.Element {
        const iconDisplay = (this.type === AwardType.best_paper) ? <i className='fas fa-trophy'></i> :
                        (this.type === AwardType.honorable_mention ? <i className="fas fa-award"></i>: <i />);
                    
        return <span className='paper-award'>{iconDisplay} {this.description}</span>;
    }
}

export function getDownloadName(pub: StrapiPublication, venues: ReadonlyArray<StrapiVenue>): string {
    let shortAuthors: string = '';
    if(pub.authors.length === 1) {
        shortAuthors = `${pub.authors[0].family_name}`;
    } else if(pub.authors.length === 2) {
        shortAuthors = `${pub.authors[0].family_name} and ${pub.authors[1].family_name}`;
    } else if(pub.authors.length > 2) {
        shortAuthors = `${pub.authors[0].family_name} et al`;
    }
    let short_venue_year: string = '';
    if(pub.venue_year) {
        if(pub.venue_year.venue) {
            const venue = findVenue(pub.venue_year.venue, venues);
            if(venue) {
                short_venue_year = `${venue.short_name}${pub.venue_year.year}`;
            } else {
                short_venue_year = `${pub.venue_year.year}`;
            }
        } else {
            short_venue_year = ``;
        }
    }
    return `${shortAuthors}-${short_venue_year}-${pub.title}`.replace(/ /g, '_').replace(/[^\w_-]/g, '');
}

export function getDateRangeString(from: Date, to: Date): string {
    const fromYear = from.toLocaleString('default', { year: 'numeric' });
    const toYear = to.toLocaleString('default', { year: 'numeric' });
    const fromMonth = from.toLocaleString('default', { month: 'short' });
    const toMonth = to.toLocaleString('default', { month: 'short' });
    const fromDay = from.toLocaleString('default', { day: 'numeric' });
    const toDay = to.toLocaleString('default', { day: 'numeric' });

    if(fromYear === toYear) {
        if(fromMonth === toMonth) {
            if(fromDay === toDay) {
                return `${fromMonth} ${fromDay}`;
            } else {
                return `${fromMonth} ${fromDay} – ${toDay}`;
            }
        } else {
            return `${fromMonth} ${fromDay} – ${toMonth} ${toDay}`;
        }
    } else {
        return `${fromMonth} ${fromDay} ${fromYear} – ${toMonth} ${toDay} ${toYear}`;
    }
}