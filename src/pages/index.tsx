import * as React from 'react'
import { MemberListDisplay, MemberListLayout } from '../components/members';
import { PublicationListDisplay } from '../components/publication-list';
import { graphql } from 'gatsby';
import { Link } from 'gatsby'
import { Layout, SpotPage } from '../components/layout';
import ReactMarkdown from 'react-markdown';
import { NewsDisplay } from './news';
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false

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
                        gatsbyImageData(
                            width: 650
                            aspectRatio: 1
                            placeholder: BLURRED
                            formats: JPG
                        )
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
    allStrapiPublication(
        filter: {venue: {type: {in: ["conference", "journal"]}}}
        sort: {venue: {year: DESC}}
    ) {
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
            date
            description {
                data {
                    description
                }
            }
            relevant_people {
                id
                family_name
                given_name
                homepage
                use_local_homepage
                color
                focused_headshot {
                    localFile {
                      childImageSharp {
                        gatsbyImageData(
                          height: 20
                          aspectRatio: 1
                          placeholder: BLURRED
                          formats: JPG
                        )
                        fluid {
                          base64
                          aspectRatio
                          src
                          srcSet
                          sizes
                        }
                      }
                    }
                }
                headshot {
                    localFile {
                      childImageSharp {
                        gatsbyImageData(
                          height: 20
                          placeholder: BLURRED
                          formats: JPG
                        )
                        fluid {
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
            relevant_publications {
                id
                title
                authors {
                    family_name
                    given_name
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
            }
        }
    }
}`;

interface IndexPageProps {
    data: {
        allStrapiAuthor: Queries.STRAPI_AUTHORConnection,
        allStrapiPublication: Queries.STRAPI_PUBLICATIONConnection,
        strapiGroup: Queries.STRAPI_GROUP,
        allStrapiNewsitem: Queries.STRAPI_NEWSITEMConnection,
    }
}

export default class extends React.Component<IndexPageProps, {}> {
    constructor(props: IndexPageProps) {
        super(props);
    }
    public render() {
        const { data } = this.props;
        const currentMembers = data.allStrapiAuthor.nodes.filter((node) => (node.membership === 'lead' || node.membership==='member'))
        // const alumMembers = data.allStrapiAuthor.nodes.filter((node) => (node.membership === 'alum'))
        return <Layout active={SpotPage.home}>
            <div className="container">
                <div className='row'>
                    <div className='col-md-7 group_description'>
                        <h2>&nbsp;</h2>
                        <ReactMarkdown>{data.strapiGroup.overview}</ReactMarkdown>
                    </div>
                    <div className='col-md-5 news'>
                        <h2>News <Link className="" to="/news">[+]</Link></h2>
                        <NewsDisplay newsItems={data.allStrapiNewsitem.nodes} condensed={true} latest={4} />
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