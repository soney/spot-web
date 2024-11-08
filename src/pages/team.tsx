import * as React from 'react'
import { MemberListDisplay, MemberListLayout } from '../components/members';
import { graphql } from 'gatsby';
import { Layout, LayoutHead, SpotPage } from '../components/layout';
import ReactMarkdown from 'react-markdown';

export const indexQuery = graphql`query team {
    allStrapiAuthor(filter: {membership: {in: ["lead", "member", "alum", "ugrad_ms_student", "member-postdoc"]}}, sort: [{membership: ASC}, {family_name: ASC}]) {
        nodes {
            id
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
            headshot {
                localFile {
                    childImageSharp {
                        gatsbyImageData(
                            width: 700
                            placeholder: BLURRED
                            formats: JPG
                            layout: CONSTRAINED
                        )
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
        allStrapiAuthor: Queries.STRAPI_AUTHORGroupConnection,
        strapiGroup: Queries.STRAPI_GROUP
    }
}

export const Head = LayoutHead('Team');

export default class extends React.Component<IndexPageProps, {}> {
    constructor(props: IndexPageProps) {
        super(props);
    }
    public render() {
        const { data } = this.props;
        // const currentMembers = data.allStrapiAuthor.nodes.filter((node) => (node.membership === 'lead' || node.membership==='member'))
        const currentMembers = data.allStrapiAuthor.nodes
                                        .filter(node => ['lead', 'member', 'member-postdoc'].includes(node.membership))
                                        .sort((a, b) => {
                                            const membershipOrder = {
                                                'lead': 1,
                                                'member-postdoc': 2,
                                                'member': 3
                                            };

                                            return membershipOrder[a.membership] - membershipOrder[b.membership];
                                        });
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
                <ReactMarkdown>{data.strapiGroup.joining}</ReactMarkdown>
            </div>
        </Layout>;
    }
}