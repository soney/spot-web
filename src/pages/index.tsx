import * as React from 'react'
import { MemberListDisplay, MemberListLayout } from '../components/members';
import { PublicationListDisplay } from '../components/publication-list';
import { graphql } from 'gatsby';
import { Link } from 'gatsby-link'
import { Layout, SpotPage } from '../components/layout';
import ReactMarkdown from 'react-markdown';

import { Strapi_AuthorGroupConnection, Strapi_PublicationGroupConnection, Strapi_Group } from '../../graphql-types';

    // allStrapiAuthor(filter: {membership: {in: ["lead", "member", "alum", "ugrad_ms_intern"]}}, sort: {fields: [membership, family_name], order: ASC}) {
export const indexQuery = graphql`query membersAndLeads {
    allStrapiAuthor(filter: {membership: {in: ["lead", "member", "alum", "ugrad_ms_intern"]}}, sort: [{ membership: ASC }, { family_name: ASC }]) {
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
            headshot {
                localFile {
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
                localFile {
                    publicURL
                }
            }
        }
    }
    strapiGroup {
        overview
        recent_pub_cutoff_year
    }
    allStrapiNewsitem {
        nodes {
            id
            createdAt
            description {
                data {
                    description
                }
            }
            relevant_people {
                family_name
                given_name
            }
        }
    }
}`;

interface IndexPageProps {
    data: {
        allStrapiAuthor: Strapi_AuthorGroupConnection,
        allStrapiPublication: Strapi_PublicationGroupConnection,
        strapiGroup: Strapi_Group
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
        const newsItemDisplays = data.allStrapiNewsitem.nodes.map((node) => {
            return <div key={node.id} className = 'col col-sm-3'>
                <ReactMarkdown>{node.description.data.description}</ReactMarkdown>
            </div>
        });
        return <Layout active={SpotPage.home}>
            <div className="container">
                <div className='row'>
                    <div className='col col-sm-9'>
                        <ReactMarkdown>{data.strapiGroup.overview}</ReactMarkdown>
                    </div>
                    <div className='col col-sm-3'>
                        <h2>News <Link className="" to="/news">[+]</Link></h2>
                        {newsItemDisplays}
                    </div>
                </div>
            </div>
            <div className="container">
                <div className='row'>
                    <div className='col col-sm-12'>
                        <h2 className="">People <Link className="" to="/team">[+]</Link></h2>
                        <MemberListDisplay layout={MemberListLayout.short_horizontal} highlightPubs={true} data={[...currentMembers/*, ...alumMembers*/]} />
                    </div>
                </div>
            </div>
            <div className="container">
                <h2>Recent Publications <Link to="/research#all-publications">[+]</Link></h2>
                <PublicationListDisplay backTo={data.strapiGroup.recent_pub_cutoff_year} groupByVenue={false} data={ data.allStrapiPublication.nodes } />
            </div>
            <footer className="container">
                <div className="row">
                    <div className="col col-sm-9">
                        <h2>Affiliations:</h2>
                    </div>
                </div>
                <div className="affiliations row">
                    <div className="col col-md-4">
                        <div>
                            <a href="https://www.si.umich.edu/" target="_blank">
                                Michigan School of Information
                            </a>
                        </div>
                        <object data="/images/umsi_logo.svg" type="image/svg+xml">
                            <img src="/images/umsi_logo.png" alt="Michigan SI Logo" />
                        </object>
                    </div>
                    <div className="col col-md-2">
                        <div>
                            <a href="https://misc.si.umich.edu/" target="_blank">
                                MISC
                            </a>
                        </div>
                        <object data="/images/misc_dark.svg" type="image/svg+xml">
                            <img src="/images/misc_dark.png" alt="Michigan MISC" />
                        </object>
                    </div>
                    <div className="col col-md-3">
                        <div>
                            <a href="https://cse.engin.umich.edu/" target="_blank">
                                Michigan CSE
                            </a>
                        </div>
                        <object data="/images/cse_logo.svg" type="image/svg+xml">
                            <img src="/images/cse_logo.png" alt="Michigan CSE Logo" />
                        </object>
                    </div>
                </div>
                <div className="row">
                    <div className="col col-md-2">
                        <h2>Sponsors:</h2>
                    </div>
                    <div className="col col-md-10 disclaimer">
                        <p>(Any views presented are those of the authors and do not necessarily represent the views of any sponsors.)</p>
                    </div>
                </div>
                <div className="row sponsors-row">
                    <div className="col col-md-3">
                        <div>
                            <a href="https://nsf.gov/" target="_blank">
                                National Science Foundation
                            </a>
                        </div>
                        <object id="nsf-logo" data="/images/nsf_logo.svg" type="image/svg+xml">
                            <img src="/images/nsf_logo.png" alt="NSF Logo" />
                        </object>
                    </div>
                    <div className="col col-md-3">
                        <div>
                            <a href="https://research.google/" target="_blank">
                                Google
                            </a>
                        </div>
                        <object id="google-logo" data="/images/google_logo.svg" type="image/svg+xml">
                            <img src="/images/google_logo.png" alt="Google Logo" />
                        </object>
                    </div>
                    <div className="col col-md-3">
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