import * as React from 'react'
import { MemberListDisplay } from '../components/members';
import { PublicationListDisplay } from '../components/publications';
import { graphql } from 'gatsby';
import Link from 'gatsby-link'
import { Layout } from '../components/layout';

import { StrapiAuthorGroupConnection, StrapiPublicationGroupConnection } from '../../graphql-types';

export const indexQuery = graphql`query membersAndLeads {
    allStrapiAuthor(filter: {membership: {in: ["lead", "member"]}}, sort: {fields: [membership, family_name], order: ASC}) {
        nodes {
            id
            given_name
            family_name
            middle_name
            homepage
            short_bio
            membership
            headshot {
                childImageSharp {
                    fixed(width: 200, height: 125) {
                        ...GatsbyImageSharpFixed
                    }
                }
            }
        }
    }
    allStrapiPublication {
        nodes {
            id
            title
            award
            award_description
            pub_details
            authors {
                id
                given_name
                family_name
                homepage
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
            }
        }
    }
}`;

interface IndexPageProps {
    data: {
        allStrapiAuthor: StrapiAuthorGroupConnection,
        allStrapiPublication: StrapiPublicationGroupConnection
    }
}

export default class extends React.Component<IndexPageProps, {}> {
    constructor(props: IndexPageProps, context: {}) {
        super(props, context);
    }
    public render() {
        const { data } = this.props;
        return <Layout>
            <p>Welcome to the homepage of the spot group.</p>
            Current members <Link to="/people">(all people)</Link>
            <MemberListDisplay data={data.allStrapiAuthor.nodes} />
            Recent publications <Link to="/all_publications">(all publications)</Link>
            <PublicationListDisplay backTo={2016} groupByVenue={false} data={ data.allStrapiPublication.nodes } />
        </Layout>;
    }
}