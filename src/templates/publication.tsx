import * as React from 'react'
import { AwardDisplay, getDownloadName, findVenue } from '../components/publications';
import { graphql } from 'gatsby';

import Link from 'gatsby-link'
import Image from 'gatsby-image';
import { StrapiPublication, StrapiAuthor, StrapiVenueConnection } from '../../graphql-types';
import { AuthorListDisplay } from '../components/authors';
import { Layout } from '../components/layout';

import './publication.scss'

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
            membership
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
        const authorsDisplay = <AuthorListDisplay withLinks={true} authors={authors} />;
        const awardDisplay = <AwardDisplay data={publication.award} description={publication.award_description} />;
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

        const pdfDisplay = publication.pdf ? <a className="btn btn-primary btn-block" href={publication.pdf.publicURL} download={downloadName}>PDF</a> : null;
        return (
            <Layout>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <h1 className="paper-title">{publication.title}</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <h2 className="paper-authors">{authorsDisplay}</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-2">
                            <h3 className="paper-venue">{venue_str}</h3>
                            {awardDisplay}
                            {pdfDisplay}
                        </div>
                        <p className="col-sm-10 paper-abstract">
                            {publication.abstract}
                        </p>
                    </div>
                </div>
            </Layout>
        );
    }
}