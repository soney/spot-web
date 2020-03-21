import { graphql } from 'gatsby';
import * as React from 'react';
import { StrapiPublicationGroupConnection } from '../../graphql-types';
import { Layout } from '../components/layout';
import { PublicationListDisplay } from '../components/publication-list';


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
                publicURL
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