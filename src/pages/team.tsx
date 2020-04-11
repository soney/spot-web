import * as React from 'react'
import { MemberListDisplay } from '../components/members';
import { PublicationListDisplay } from '../components/publication-list';
import { graphql } from 'gatsby';
import Link from 'gatsby-link'
import { Layout, SpotPage } from '../components/layout';
import * as ReactMarkdown from 'react-markdown';

import { StrapiAuthorGroupConnection, StrapiPublicationGroupConnection, StrapiGroup } from '../../graphql-types';

export const indexQuery = graphql`query team {
    allStrapiAuthor(filter: {membership: {in: ["lead", "member"]}}, sort: {fields: [membership, family_name], order: ASC}) {
        nodes {
            id
            strapiId
            color
            given_name
            family_name
            middle_name
            homepage
            short_bio
            membership
            headshot {
                childImageSharp {
                    fluid(maxWidth: 700) {
                        base64
                        aspectRatio
                        src
                        srcSet
                        sizes
                    }
                }
            }
        }
    }
    strapiGroup {
        overview 
        joining
    }
}`;

interface IndexPageProps {
    data: {
        allStrapiAuthor: StrapiAuthorGroupConnection,
        strapiGroup: StrapiGroup
    }
}

export default class extends React.Component<IndexPageProps, {}> {
    constructor(props: IndexPageProps, context: {}) {
        super(props, context);
    }
    public render() {
        const { data } = this.props;
        return <Layout active={SpotPage.team}>
            <div className="container">
                <h2 className="">Current Team Members</h2>
                <MemberListDisplay highlightPubs={false} data={data.allStrapiAuthor.nodes} />
            </div>
            <div className="container">
                <h2 className="">Join</h2>
                <ReactMarkdown source={data.strapiGroup.joining} />
            </div>
        </Layout>;
    }
}