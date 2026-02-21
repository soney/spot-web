import { graphql } from 'gatsby';
import * as React from 'react';
import { AuthorListDisplay } from '../components/authors';
import { Layout, LayoutHead, SpotPage } from '../components/layout';
import { AwardDisplay, getDownloadName } from '../components/publications';
import './publication.scss';

export const pubQuery = graphql`query publication($id: String!) {
    strapiPublication(id: {eq: $id}) {
        id
        title
        abstract
        award
        award_description
        submission_status
        pdf {
            id
            localFile {
                publicURL
            }
        }
        authors {
            id
            given_name
            family_name
            homepage
        }
        venue {
            id
            year
            short_name
            name_year
            homepage
        }
    }
}`;


interface PublicationProps {
    data: {
        strapiPublication: Queries.STRAPI_PUBLICATION,
        allStrapiVenue: Queries.STRAPI_VENUEConnection
    }
}

export const Head = LayoutHead((props: PublicationProps) => `${props.data.strapiPublication.title}`);

export default class extends React.Component<PublicationProps, {}> {
    constructor(props: PublicationProps) {
        super(props);
    }
    public render() {
        const publication = this.props.data.strapiPublication;

        const authors = Array.from(publication.authors) as any as Queries.STRAPI_AUTHOR[];
        const authorsDisplay = <AuthorListDisplay withLinks={true} authors={authors} />;
        const awardDisplay = <AwardDisplay data={publication.award} description={publication.award_description} />;
        const downloadName = getDownloadName(publication);

        let venue_str: string | JSX.Element = '';
        if (publication.venue) {
            const { venue } = publication;
            if (venue) {
                if (venue.short_name) {
                    venue_str = `${venue.short_name} ${publication.venue.year}`;
                } else {
                    venue_str = `${venue.name_year}`;
                }
            } else {
                venue_str = `${publication.venue.year}`;
            }

            if (venue.homepage) {
                venue_str = <a target='_blank' href={venue.homepage}>{venue_str}</a>;
            }
        } else {
            venue_str = ``;
        }

        const condAcceptDisplay = publication.status === 'conditionally_accepted' ? <span className="conditionally_accepted">(conditionally accepted)</span> : null;

        const pdfDisplay = publication.pdf ? <a className="btn btn-primary btn-block" href={publication.pdf.localFile.publicURL} download={downloadName}>PDF</a> : null;
        return (
            <Layout active={SpotPage.research} additionalInfo={publication.title}>
                <div className="container" itemScope itemType="http://schema.org/ScholarlyArticle">
                    <div className="row">
                        <div className="col">
                            <h1 className="paper-title" itemProp="name">{publication.title}</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <h2 className="paper-authors">{authorsDisplay}</h2>
                        </div>
                    </div>
                    <div className="row">
                        <p className="col-sm-10 paper-abstract" itemProp="abstract">
                            {publication.abstract}
                        </p>
                        <div className="col-sm-2">
                            <h3 className="paper-venue" itemProp="publisher">
                                {venue_str}
                            </h3>
                            {condAcceptDisplay}
                            {awardDisplay}
                            {pdfDisplay}
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}