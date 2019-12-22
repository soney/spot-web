import * as React from 'react'
import { AwardDisplay, getDownloadName, findVenue } from '../templates/publications';
import { graphql } from 'gatsby';

import Link from 'gatsby-link'
import Image from 'gatsby-image';
import { StrapiPublication, StrapiAuthor, StrapiVenueConnection } from '../../graphql-types';
import { AuthorListDisplay } from '../templates/authors';

export const pubQuery = graphql`query publication($id: String!) {
    strapiPublication(id: {eq: $id}) {
        id
        title
        abstract
        award
        pdf {
            id
            publicURL
        }
        authors {
            id
            given_name
            family_name
            homepage
        }
        venue_year {
            id
            year
            venue
            homepage
        }
    }
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


interface PublicationProps {
    data: {
        strapiPublication: StrapiPublication,
        allStrapiVenue: StrapiVenueConnection
    }
}

export default class extends React.Component<PublicationProps, {}> {
    constructor(props: PublicationProps, context: {}) {
        super(props, context);
    }
    public render() {
        const publication = this.props.data.strapiPublication;
        const venues = this.props.data.allStrapiVenue.nodes;

        const authors = Array.from(publication.authors) as any as StrapiAuthor[];
        const authorsDisplay = <AuthorListDisplay authors={authors} />;
        const awardDisplay = <AwardDisplay data={publication.award} />;
        const downloadName = getDownloadName(publication, venues);

        let venue_str: string = '';
        if(publication.venue_year) {
            const venue = findVenue(publication.venue_year.venue, venues);
            if(venue) {
                venue_str = `${venue.short_name} ${publication.venue_year.year}`;
            } else {
                venue_str = `${publication.venue_year.year}`;
            }
        } else {
            venue_str = ``;
        }
        console.log(publication.venue_year.homepage)

        const pdfDisplay = publication.pdf ? <a href={publication.pdf.publicURL} download={downloadName}>PDF</a> : null;
        return (
            <div>
                <Link to='/'>(home)</Link>
                <h1>{publication.title}</h1>
                <h2>{venue_str}</h2>
                {awardDisplay}
                <ul>
                    {authorsDisplay}
                </ul>
                {pdfDisplay}
                <p>{publication.abstract}</p>
            </div>
        );
    }
}