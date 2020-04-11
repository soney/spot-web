import * as React from 'react'
import { MemberListDisplay, MemberListLayout } from '../components/members';
import { PublicationListDisplay } from '../components/publication-list';
import { graphql } from 'gatsby';
import Link from 'gatsby-link'
import { Layout, SpotPage } from '../components/layout';
import * as ReactMarkdown from 'react-markdown';

import { StrapiAuthorGroupConnection, StrapiPublicationGroupConnection, StrapiGroup } from '../../graphql-types';

export const indexQuery = graphql`query membersAndLeads {
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
            long_bio
            membership
            use_local_homepage
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
            }
            pdf {
                publicURL
            }
        }
    }
    strapiGroup {
        overview
    }
}`;

interface IndexPageProps {
    data: {
        allStrapiAuthor: StrapiAuthorGroupConnection,
        allStrapiPublication: StrapiPublicationGroupConnection,
        strapiGroup: StrapiGroup
    }
}

export default class extends React.Component<IndexPageProps, {}> {
    constructor(props: IndexPageProps, context: {}) {
        super(props, context);
    }
    public render() {
        const { data } = this.props;
        return <Layout active={SpotPage.home}>
            <div className="container">
                <ReactMarkdown source={data.strapiGroup.overview} />
            </div>
            <div className="container">
                {/* <h2 className="">People <Link className="" to="/people">(all people)</Link></h2> */}
                <h2 className="">People</h2>
                <MemberListDisplay layout={MemberListLayout.short_horizontal} highlightPubs={true} data={data.allStrapiAuthor.nodes} />
            </div>
            <div className="container">
                <h2>Recent publications <Link to="/research#all-publications">(all publications)</Link></h2>
                <PublicationListDisplay backTo={2016} groupByVenue={false} data={ data.allStrapiPublication.nodes } />
            </div>
        </Layout>;
    }
}