import * as React from 'react'
import { forEach } from 'lodash';
import Link from 'gatsby-link'

import '@fortawesome/fontawesome-free/scss/fontawesome.scss'
import '@fortawesome/fontawesome-free/scss/solid.scss'

export default class extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context)
    }
    public render() {
        const { data } = this.props;
        const venue_year_pubs = new Map();
        const venue_year_displays = new Map();
        data.publications.nodes.forEach((pub: any) => {
            const {venue_year} = pub;
            if(venue_year) {
                const vyid = venue_year.id;

                if(venue_year_pubs.has(vyid)) {
                    venue_year_pubs.get(vyid).push(pub);
                } else {
                    venue_year_pubs.set(vyid, [pub]);
                    const matchingVenues =  data.venues.nodes.filter((v: any) => v.strapiId===venue_year.venue);
                    if(matchingVenues.length > 0) {
                        const venue = matchingVenues[0];
                        const { conference_start, conference_end } = venue_year;
                        venue_year_displays.set(vyid, {short_name: venue.short_name, year: venue_year.year, conference_start, conference_end});
                    }
                }
            }
        });
        const vypubs = [];
        venue_year_pubs.forEach((pubs, id) => {
            const d = venue_year_displays.get(id);
            vypubs.push({pubs, id, year: d.year, conference_start: new Date(d.conference_start).getTime(), conference_end: new Date(d.conference_end).getTime()});
        })
        vypubs.sort((a: any, b: any) => {
            return b.conference_start - a.conference_start;
        });
        const by_venue = [];
        vypubs.forEach(({pubs, id}) => {
            const publicationDisplays = pubs.map((node: any) => (
                <PublicationSummary key={node.id} data={node} venues={data.venues} />
            ));
            const vyDisplay = venue_year_displays.get(id);
            by_venue.push(<li key={id}>
                    {vyDisplay.short_name} {vyDisplay.year}
                    <ul>{publicationDisplays}</ul>
               </li>);
        });
        return <ul>{by_venue}</ul>
    }
}

class PublicationSummary extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context)
    }
    public render() {
        const { data, venues } = this.props;
        let year_display = null;
        let venue_display = null;
        let venue_short_name = null;
        let venue_location = null;
        let year = null;
        if(data.venue_year) {
            const matchingVenues =  venues.nodes.filter((v: any) => v.strapiId===data.venue_year.venue);
            if(matchingVenues.length > 0) {
                const venue = matchingVenues[0];
                venue_display = <span className="paper-venue">{venue.long_name}</span>;
                venue_short_name = venue.short_name;
            }
            venue_location = data.venue_year.location;
            year = data.venue_year.year;
            year_display = <span className="paper-year">{year}</span>;
        }
        
        const authorsDisplay = data.authors.map((author: any) => {
            // if(author.homepage) {
                // return <span key={author.id} className='paper-author'><a href={author.homepage} target='_blank'>{author.given_name} {author.family_name}</a></span>
            // } else {
                return <span key={author.id} className='paper-author'>{author.given_name} {author.family_name}</span>
            // }
        });
        
        if (authorsDisplay.length === 2) {
            authorsDisplay.splice(1, 0, ' and ');
        } else if (authorsDisplay.length > 2) {
            authorsDisplay.splice(authorsDisplay.length-1, 0, ', and ');
            for(let i: number = authorsDisplay.length-3; i>0; i--) {
                authorsDisplay.splice(i, 0, ', ');
            }
        }
        const awardDisplay = (data.award === 'best_paper') ? <i className='fas fa-trophy'></i> :
                (data.award === 'honorable_mention' ? <i className="fas fa-award"></i>: null);
        
        // console.log(data.pdf);
        const firstAuthor = data.authors.length > 0 ? data.authors[0].family_name : '';
        const fname = `${firstAuthor}-${venue_short_name}${year}-${data.title}`.replace(/ /g, '_').replace(/[^\w_-]/g, '');
        const pdfDisplay = data.pdf ? <a href={data.pdf.publicURL} download={fname}>PDF</a> : null;

        // const start = new Date(new Date(data.venue_year.conference_start).getTime() + 12*60*60*1000);
        // const end = new Date(new Date(data.venue_year.conference_end).getTime() + 12*60*60*1000);
        // console.log(start, end);

        // console.log(data);
        return <li className='paper-summary'>
            <span className='paper-authors'>{authorsDisplay}</span>. <span className="paper-title"><Link to={`/p/${fname}`}>{data.title}</Link></span>. {venue_display}. ({year_display}). {venue_location} {data.pub_details}.
            {awardDisplay}
            {pdfDisplay}
            {/* <span className="paper-title">{data.title}.</span> <span className="paper-venue">{data.venue.long_name} ({data.venue.short_name})</span>. <span className="paper-year">{data.year}</span> */}
            {/* {mediaDisplays} */}
        </li>;
    }

}