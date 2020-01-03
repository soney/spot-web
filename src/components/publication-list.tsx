import '@fortawesome/fontawesome-free/scss/fontawesome.scss';
import '@fortawesome/fontawesome-free/scss/solid.scss';
import { StaticQuery } from 'gatsby';
import * as React from 'react';
import { StrapiPublication, StrapiPublicationVenue_Year, StrapiVenueGroupConnection } from '../../graphql-types';
import { findVenue, PublicationSummaryWithVenuesDisplay, venuesQuery } from './publications';

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