import * as React from 'react'
import { MemberListDisplay, MemberListLayout } from '../components/members';
import { graphql } from 'gatsby';
import { Layout, SpotPage } from '../components/layout';
import * as ReactMarkdown from 'react-markdown';

import { StrapiAuthorGroupConnection, StrapiPublicationGroupConnection, StrapiGroup } from '../../graphql-types';

export const indexQuery = graphql`query team {
    allStrapiAuthor(filter: {membership: {in: ["lead", "member", "alum", "ugrad_ms_student"]}}, sort: {fields: [membership, family_name], order: ASC}) {
        nodes {
            id
            strapiId
            color
            given_name
            family_name
            middle_name
            homepage
            short_bio
            long_bio
            membership
            use_local_homepage
            links {
                id
                url
                description
            }
            media {
                id
                description
                media {
                    publicURL
                }
            }
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
    constructor(props: IndexPageProps) {
        super(props);
    }
    public render() {
        const { data } = this.props;
        const currentMembers = data.allStrapiAuthor.nodes.filter((node) => (node.membership === 'lead' || node.membership==='member'))
        const alumMembers = data.allStrapiAuthor.nodes.filter((node) => (node.membership === 'alum'))
        const ugradMs = data.allStrapiAuthor.nodes.filter((node) => (node.membership === 'ugrad_ms_student'))
        return <Layout active={SpotPage.team}>
            <div className="container">
                <h2 className="">Current Members</h2>
                <MemberListDisplay layout={MemberListLayout.full_vertical} highlightPubs={false} data={currentMembers} />
            </div>
            { alumMembers.length > 0 &&
                <div className="container">
                    <h2 className="">Ph.D. Alumni</h2>
                    <MemberListDisplay layout={MemberListLayout.full_vertical} highlightPubs={false} data={alumMembers} />
                </div>
            }
            { ugradMs.length > 0 &&
                <div className="container">
                    <h2 className="">Other Collaborators (Undergraduate and Master's)</h2>
                    <MemberListDisplay layout={MemberListLayout.simple_list} highlightPubs={false} data={ugradMs} />
                </div>
            }
            <div className="container">
                <h2 className="">Join Us</h2>
                <ReactMarkdown source={data.strapiGroup.joining} />
            </div>
        </Layout>;
    }
}