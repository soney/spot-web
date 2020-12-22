import '@fortawesome/fontawesome-free/scss/fontawesome.scss';
import '@fortawesome/fontawesome-free/scss/solid.scss';
import * as React from 'react';
import { StrapiPublication, StrapiPublicationVenue } from '../../graphql-types';
import { PublicationSummaryDisplay } from './publications';

export enum PublicationDetailLevel {
    title='title', title_author_venue='title_author_venue'
}

interface PublicationListDisplayProps {
    groupByVenue: boolean;
    data: ReadonlyArray<StrapiPublication>
    detailLevel?: PublicationDetailLevel
    backTo?: number
    highlightAuthors?: number[]
}
export class PublicationListDisplay extends React.Component<PublicationListDisplayProps, {}> {
    constructor(props: PublicationListDisplayProps) {
        super(props);
    }
    public render() {
        const { data, groupByVenue, backTo } = this.props;
        const venuePubs: Map<number, StrapiPublication[]> = new Map();
        const idToVenueYear: Map<number, StrapiPublicationVenue> = new Map();
        const venueTimes: Map<number, number> = new Map();
        data.forEach((pub) => {
            const { venue } = pub;
            if(!backTo || venue.year >= backTo) {
                const vid = venue ? venue.id : -1;
                if(venuePubs.has(vid)) {
                    venuePubs.get(vid).push(pub);
                } else {
                    venuePubs.set(vid, [pub]);
                    idToVenueYear.set(vid, venue);
                }

                if(venue && venue.conference_start && venue.conference_start.match(new RegExp("\\d+/\\d+")) && venue.year) {
                    const { conference_start, year } = venue;
                    const [month, day] = conference_start.split('/').map(d => parseInt(d));
                    venueTimes.set(vid, new Date(`${year}-${month}-${day}`).getTime());
                }
            }
        });
        const vOrder = Array.from(venuePubs.keys()).sort((a, b) => {
            const aVenueTime = venueTimes.has(a) ? venueTimes.get(a) : -1;
            const bVenueTime = venueTimes.has(b) ? venueTimes.get(b) : -1;
            return bVenueTime - aVenueTime;
        });
        if(groupByVenue) {
            const vyDisplays: (JSX.Element|string)[] = vOrder.map((vid: number) => {
                let venueString: string;
                const venue = idToVenueYear.get(vid);
                if(venue) {
                    venueString = `${venue.short_name} ${venue.year}`;
                } else {
                    venueString = `...`;
                }

                const pubDisplays = venuePubs.get(vid).map((pub) => {
                    return <li key={pub.id}><PublicationSummaryDisplay detailLevel={this.props.detailLevel} data={pub} /></li>;
                });

                const venueDisplay = venue.homepage ?
                    <span className="venue"><a href={venue.homepage} target='_blank'>{venueString}</a></span> :
                    <span className="venue">{venueString}</span>;

                return <li key={vid}>
                    {venueDisplay}
                    <ul>{pubDisplays}</ul>
                </li>;
            });

            return <ul className="publication-list">
                {vyDisplays}
            </ul>;
        } else {
            const pubDisplays: JSX.Element[] = [];
            vOrder.forEach((vyid: number) => {
                venuePubs.get(vyid).forEach((pub) => {
                    pubDisplays.push(<li key={pub.id}><PublicationSummaryDisplay detailLevel={this.props.detailLevel} highlightAuthors={this.props.highlightAuthors} data={pub} /></li>);
                });
            });

            return <ul className="publication-list">{pubDisplays}</ul>;
        }
    }
}