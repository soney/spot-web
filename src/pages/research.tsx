import { graphql } from 'gatsby';
import * as React from 'react';
import { Layout, SpotPage } from '../components/layout';
import { PublicationListDisplay, PublicationDetailLevel } from '../components/publication-list';
import ReactMarkdown from 'react-markdown';
import { AuthorListDisplay } from '../components/authors';


export const indexQuery = graphql`query allPubs {
    allStrapiPublication(filter: {venue: {type: {in: ["conference", "journal"]}}}) {
        nodes {
            id
            title
            award
            award_description
            pub_details
            short_description
            status
            authors {
                id
                given_name
                family_name
                homepage
                membership
                use_local_homepage
            }
            venue {
                id
                location
                year
                homepage
                conference_start
                conference_end
                short_name
                full_name
                type
            }
            pdf {
                localFile {
                    publicURL
                }
            }
        }
    }
    allStrapiCluster {
        nodes {
            id
            title
            description
            publications {
                id
            }
            authors {
                id
                family_name
                given_name
                homepage
                membership
            }
        }
    }
}`;

interface IndexPageProps {
    data: {
        allStrapiPublication: Queries.STRAPI_PUBLICATIONConnection,
        allStrapiCluster: Queries.STRAPI_CLUSTERConnection
    }
}

export default class extends React.Component<IndexPageProps, {}> {
    constructor(props: IndexPageProps) {
        super(props);
    }
    public render() {
        const { data } = this.props;
        const focusAreas = data.allStrapiCluster.nodes.map((cluster) => {
            const { id, title, description, authors, publications } = cluster;
            const authorDisplays = <AuthorListDisplay withLinks={true} authors={authors as any} />
            const detailedPubs = publications.map((pub) => {
                const { id } = pub;
                return data.allStrapiPublication.nodes.find((p: Queries.STRAPI_PUBLICATION) => p.id===id);
            });
            return <div key={id} className="row">
                <div className="col-md-4">
                    <h5>{title}</h5>
                    <div><strong>People: </strong>{authorDisplays}</div>
                    <ReactMarkdown>{description}</ReactMarkdown>
                </div>
                <div className="col-md-8">
                    <div><strong>Publications: </strong></div>
                    <PublicationListDisplay detailLevel={PublicationDetailLevel.title} data={detailedPubs} groupByVenue={false} />
                </div>
            </div>;
        });
        shuffle(focusAreas);

        return <Layout active={SpotPage.research}>
            <div className="container">
                <h2>Focus Areas</h2> {focusAreas}
                <h2 id='all-publications'>All Publications</h2> <PublicationListDisplay groupByVenue={false} data={ data.allStrapiPublication.nodes } />
            </div>
        </Layout>;
    }
}

function shuffle(a: any[]): any[] {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}