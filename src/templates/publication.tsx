import { graphql } from 'gatsby';
import * as React from 'react';
import { StrapiAuthor, StrapiPublication, StrapiVenueConnection } from '../../graphql-types';
import { AuthorListDisplay } from '../components/authors';
import { Layout, SpotPage } from '../components/layout';
import { AwardDisplay, getDownloadName } from '../components/publications';
import './publication.scss';

export const pubQuery = graphql`query publication($id: String!) {
    strapiPublication(id: {eq: $id}) {
        id
        title
        abstract
        award
        award_description
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
        venue {
            id
            year
            short_name
            homepage
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

        const authors = Array.from(publication.authors) as any as StrapiAuthor[];
        const authorsDisplay = <AuthorListDisplay withLinks={true} authors={authors} />;
        const awardDisplay = <AwardDisplay data={publication.award} description={publication.award_description} />;
        const downloadName = getDownloadName(publication);

        let venue_str: string|JSX.Element = '';
        if(publication.venue) {
            const { venue } = publication;
            if(venue) {
                venue_str = `${venue.short_name} ${publication.venue.year}`;
            } else {
                venue_str = `${publication.venue.year}`;
            }

            if(venue.homepage) {
                venue_str = <a target='_blank' href={venue.homepage}>{venue_str}</a>;
            }
        } else {
            venue_str = ``;
        }

        const pdfDisplay = publication.pdf ? <a className="btn btn-primary btn-block" href={publication.pdf.publicURL} download={downloadName}>PDF</a> : null;
        return (
            <Layout title={`${publication.title}`} active={SpotPage.research} additionalInfo={publication.title}>
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
                        <p className="col-sm-10 paper-abstract">
                            {publication.abstract}
                        </p>
                        <div className="col-sm-2">
                            <h3 className="paper-venue">
                                {venue_str}
                            </h3>
                            {awardDisplay}
                            {pdfDisplay}
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}