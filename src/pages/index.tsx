import * as React from 'react'
import { MemberListDisplay } from '../components/members';
import { PublicationListDisplay } from '../components/publication-list';
import { graphql } from 'gatsby';
import Link from 'gatsby-link'
import { Layout } from '../components/layout';

import { StrapiAuthorGroupConnection, StrapiPublicationGroupConnection } from '../../graphql-types';

export const indexQuery = graphql`query membersAndLeads {
    allStrapiAuthor(filter: {membership: {in: ["lead", "member"]}}, sort: {fields: [membership, family_name], order: ASC}) {
        nodes {
            id
            strapiId
            given_name
            family_name
            middle_name
            homepage
            short_bio
            membership
            headshot {
                childImageSharp {
                    fluid(maxWidth: 700) {
                        ...GatsbyImageSharpFluid_noBase64
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
            <div className="container">
                <p>Computer programming skills are becoming indispensable for a variety of professions. However, computer programming is often prohibitively difficult to learn or do correctly. Many programming languages and tools were designed around the needs and limitations of the computers executing code, which can lead to design features that are counterintuitive for the people who use those tools.</p>

                <p>We are a research group at <a href="https://umich.edu/" target="_blank">the University of Michigan</a>, primarily in the <a href="https://www.si.umich.edu/" target="_blank">School of Information</a> and <a href="https://cse.engin.umich.edu/" target="_blank">Computer Science</a>. Our research focuses on understanding the factors that make programming tools usable and designing &amp; building new tools for programmers.</p>
            </div>
            <div className="container">
                {/* <h2 className="">People <Link className="" to="/people">(all people)</Link></h2> */}
                <h2 className="">People</h2>
                <MemberListDisplay data={data.allStrapiAuthor.nodes} />
            </div>
            <div className="container">
                <h2>Recent publications <Link to="/research">(all publications)</Link></h2>
                <PublicationListDisplay backTo={2016} groupByVenue={false} data={ data.allStrapiPublication.nodes } />
            </div>
        </Layout>;
    }
}