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
    limit: number|boolean
}

export class PublicationListDisplay extends React.Component<PublicationListDisplayProps, {}> {
    constructor(props: PublicationListDisplayProps, context: {}) {
        super(props, context)
    }
    public render(): JSX.Element {
        return <StaticQuery query={venuesQuery}
                render={venuesData => <PublicationListDisplayWithVenues limit={this.props.limit} groupByVenue={this.props.groupByVenue} data={this.props.data} venues={venuesData.allStrapiVenue} />} />;
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
        const { data, groupByVenue, venues, limit } = this.props;
        const venuePubs: Map<number, StrapiPublication[]> = new Map();
        const idToVenueYear: Map<number, StrapiPublicationVenue_Year> = new Map();
        const venueTimes: Map<number, number> = new Map();
        data.forEach((pub) => {
            const { venue_year } = pub;
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

                const venueDisplay = venueYear.homepage ? <a href={venueYear.homepage} target='_blank'>{venueString}</a> : {venueString};

                return <li key={vyid}>
                    {venueDisplay}
                    <ul>{pubDisplays}</ul>
                </li>;
            });

            return <ul>
                {vyDisplays}
            </ul>;
        } else {
            const pubDisplays: JSX.Element[] = [];
            vyOrder.forEach((vyid: number) => {
                venuePubs.get(vyid).forEach((pub) => {
                    pubDisplays.push(<li key={pub.id}><PublicationSummaryWithVenuesDisplay data={pub} venues={venues} /></li>);
                });
            });

            return <ul>{pubDisplays}</ul>;
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
            // <div>papahs</div>;

        // const venue_year_pubs = new Map();
        // const venue_year_displays = new Map();
        // data.publications.nodes.forEach((pub: any) => {
        //     const {venue_year} = pub;
        //     if(venue_year) {
        //         const vyid = venue_year.id;

        //         if(venue_year_pubs.has(vyid)) {
        //             venue_year_pubs.get(vyid).push(pub);
        //         } else {
        //             venue_year_pubs.set(vyid, [pub]);
        //             const matchingVenues =  data.venues.nodes.filter((v: any) => v.strapiId===venue_year.venue);
        //             if(matchingVenues.length > 0) {
        //                 const venue = matchingVenues[0];
        //                 const { conference_start, conference_end } = venue_year;
        //                 venue_year_displays.set(vyid, {short_name: venue.short_name, year: venue_year.year, conference_start, conference_end});
        //             }
        //         }
        //     }
        // });
        // const vypubs = [];
        // venue_year_pubs.forEach((pubs, id) => {
        //     const d = venue_year_displays.get(id);
        //     vypubs.push({pubs, id, year: d.year, conference_start: new Date(d.conference_start).getTime(), conference_end: new Date(d.conference_end).getTime()});
        // })
        // vypubs.sort((a: any, b: any) => {
        //     return b.conference_start - a.conference_start;
        // });
        // const by_venue = [];
        // vypubs.forEach(({pubs, id}) => {
        //     const publicationDisplays = pubs.map((node: any) => (
        //         <PublicationSummary key={node.id} data={node} venues={data.venues} />
        //     ));
        //     const vyDisplay = venue_year_displays.get(id);
        //     by_venue.push(<li key={id}>
        //             {vyDisplay.short_name} {vyDisplay.year}
        //             <ul>{publicationDisplays}</ul>
        //        </li>);
        // });
        // return <ul>{by_venue}</ul>
    
interface PublicationSummaryDisplayProps {
    data: StrapiPublication
}

export class PublicationSummaryDisplay extends React.Component<PublicationSummaryDisplayProps, {}> {
    constructor(props: PublicationSummaryDisplayProps, context: {}) {
        super(props, context)
    }

    public render(): JSX.Element {
        return <StaticQuery query={venuesQuery}
                render={venuesData => <PublicationSummaryWithVenuesDisplay data={this.props.data} venues={venuesData.allStrapiVenue} />} />;
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
        let venue_long_name: string;
        if(venue) {
            venue_long_name = `${venue.long_name} (${data.venue_year.year}). ${data.venue_year.location}`;
        } else {
            venue_long_name = `(${data.venue_year.year}). ${data.venue_year.location}`;
        }
        const downloadName = getDownloadName(data, venues.nodes);
        // const pdfDownload = data.pdf ? <a href={data.pdf.publicURL} download={downloadName}>PDF</a> : null;
        return <span>
            <AuthorListDisplay authors={authors} />. <Link to={`/p/${downloadName}`}>{data.title}</Link>. {venue_long_name} {data.pub_details} <AwardDisplay data={data.award} />
        </span>;
    }
}

interface AwardDisplayProps {
    data: string|null
}
export class AwardDisplay extends React.Component<AwardDisplayProps, {}> {
    constructor(props: any, context: any) {
        super(props, context)
    }
    public render():JSX.Element {
        const { data } = this.props;
        return (data === 'best_paper') ? <i className='fas fa-trophy'></i> :
                (data === 'honorable_mention' ? <i className="fas fa-award"></i>: <i />);
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