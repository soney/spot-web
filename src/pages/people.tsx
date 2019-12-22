import * as React from 'react'
import { MemberListDisplay } from '../components/members';
import { PublicationListDisplay } from '../components/publications';
import { graphql } from 'gatsby';
import Link from 'gatsby-link'
import { Layout } from '../components/layout';

import { StrapiAuthorGroupConnection, StrapiPublicationGroupConnection } from '../../graphql-types';

export const indexQuery = graphql`query allMembers {
    allStrapiAuthor(filter: {membership: {in: ["lead", "member", "alum"]}}, sort: {fields: [membership, family_name], order: ASC}) {
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
            <MemberListDisplay data={data.allStrapiAuthor.nodes} />
        </Layout>;
    }
}