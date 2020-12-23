import * as React from 'react'
import { MemberListDisplay, MemberListLayout } from '../components/members';
import { PublicationListDisplay } from '../components/publication-list';
import { graphql } from 'gatsby';
import Link from 'gatsby-link'
import { Layout, SpotPage } from '../components/layout';
import * as ReactMarkdown from 'react-markdown';

import { StrapiAuthorGroupConnection, StrapiPublicationGroupConnection, StrapiGroup } from '../../graphql-types';

export const indexQuery = graphql`query membersAndLeads {
    allStrapiAuthor(filter: {membership: {in: ["lead", "member", "alum", "ugrad_ms_intern"]}}, sort: {fields: [membership, family_name], order: ASC}) {
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
    constructor(props: IndexPageProps) {
        super(props);
    }
    public render() {
        const { data } = this.props;
        const currentMembers = data.allStrapiAuthor.nodes.filter((node) => (node.membership === 'lead' || node.membership==='member'))
        const alumMembers = data.allStrapiAuthor.nodes.filter((node) => (node.membership === 'alum'))
        return <Layout active={SpotPage.home}>
            <div className="container">
                <ReactMarkdown source={data.strapiGroup.overview} />
            </div>
            <div className="container">
                <h2 className="">People <Link className="" to="/team">[+]</Link></h2>
                {/* <h2 className="">People</h2> */}
                <MemberListDisplay layout={MemberListLayout.short_horizontal} highlightPubs={true} data={[...currentMembers, ...alumMembers]} />
            </div>
            <div className="container">
                <h2>Recent Publications <Link to="/research#all-publications">[+]</Link></h2>
                <PublicationListDisplay backTo={2016} groupByVenue={false} data={ data.allStrapiPublication.nodes } />
            </div>
            <footer className="container">
                <div className="row">
                    <div className="col col-sm-9">
                        <h5>Affiliations:</h5>
                    </div>
                </div>
                <div className="affiliations row">
                    <div className="col col-sm-4">
                        <div>
                            <a href="https://www.si.umich.edu/" target="_blank">
                                Michigan School of Information
                            </a>
                        </div>
                        <object data="/images/umsi_logo.svg" type="image/svg+xml">
                            <img src="/images/umsi_logo.png" alt="Michigan SI Logo" />
                        </object>
                    </div>
                    <div className="col col-sm-2">
                        <div>
                            <a href="https://misc.si.umich.edu/" target="_blank">
                                MISC
                            </a>
                        </div>
                        <object data="/images/misc_dark.svg" type="image/svg+xml">
                            <img src="/images/misc_dark.png" alt="Michigan MISC" />
                        </object>
                    </div>
                    <div className="col col-sm-3">
                        <div>
                            <a href="https://misc.si.umich.edu/" target="_blank">
                                Michigan CSE
                            </a>
                        </div>
                        <object data="/images/cse_logo.svg" type="image/svg+xml">
                            <img src="/images/cse_logo.png" alt="Michigan CSE Logo" />
                        </object>
                    </div>
                </div>
                <div className="row">
                    <div className="col col-sm-2">
                        <h5>Sponsors:</h5>
                    </div>
                    <div className="col col-sm-10 disclaimer">
                        <p>(Any views presented are those of the authors and do not necessarily represent the views of any sponsors.)</p>
                    </div>
                </div>
                <div className="row sponsors-row">
                    <div className="col col-sm-3">
                        <div>
                            <a href="https://nsf.gov/" target="_blank">
                                National Science Foundation
                            </a>
                        </div>
                        <object id="nsf-logo" data="/images/nsf_logo.svg" type="image/svg+xml">
                            <img src="/images/nsf_logo.png" alt="NSF Logo" />
                        </object>
                    </div>
                    <div className="col col-sm-3">
                        <div>
                            <a href="https://research.google/" target="_blank">
                                Google
                            </a>
                        </div>
                        <object id="google-logo" data="/images/google_logo.svg" type="image/svg+xml">
                            <img src="/images/google_logo.png" alt="Google Logo" />
                        </object>
                    </div>
                    <div className="col col-sm-3">
                        <div>
                            <a href="https://research.adobe.com/" target="_blank">
                                Adobe, Inc.
                            </a>
                        </div>
                        <object id="adobe-logo" data="/images/adobe_logo.svg" type="image/svg+xml">
                            <img src="/images/adobe_logo.png" alt="Adobe Logo" />
                        </object>
                    </div>
                </div>
            </footer>
        </Layout>;
    }
}