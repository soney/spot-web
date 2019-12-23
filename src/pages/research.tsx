import * as React from 'react'
import { PublicationListDisplay } from '../components/publications';
import { graphql } from 'gatsby';
import Link from 'gatsby-link'
import { Layout } from '../components/layout';

import { StrapiPublicationGroupConnection } from '../../graphql-types';

export const indexQuery = graphql`query allPubs {
    allStrapiPublication {
        nodes {
            id
            title
            award
            award_description
            pub_details
            short_description
            authors {
                id
                given_name
                family_name
                homepage
                membership
            }
            venue_year {
                id
                location
                venue
                year
                homepage
                conference_start
                conference_end
            }
            pdf {
                publicURL
                childImageSharp {
                    fixed(width: 200, height: 125) {
                        ...GatsbyImageSharpFixed
                    }
                }
            }
        }
    }
}`;

interface IndexPageProps {
    data: {
        allStrapiPublication: StrapiPublicationGroupConnection
    }
}

export default class extends React.Component<IndexPageProps, {}> {
    constructor(props: IndexPageProps, context: {}) {
        super(props, context);
    }
    public render() {
        const { data } = this.props;
        // console.log(data.allStrapiPublication.nodes)
        return <Layout>
            <div className="container">
                <h2>Publications</h2>
                <PublicationListDisplay groupByVenue={false} data={ data.allStrapiPublication.nodes } />
            </div>
        </Layout>;
    }
}