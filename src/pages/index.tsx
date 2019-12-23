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
            <div className="container">
                <p>We are a research group at <a href="https://umich.edu/" target="_blank">the University of Michigan</a>, primarily in the <a href="https://www.si.umich.edu/" target="_blank">School of Information</a>.
                focused on creating tools that make it easier to create.</p>
                {/* <p className="spot-lead">In an increasingly computer-driven interconnected world, computer programming skills are becoming indispensable for a variety of professions. Some believe programming is becoming a literacy - a skill that is crucial to meaningfully participating in a society where computer programs mediate the ways we connect with services and communicate with each other. At its core, computer programming allows people to leverage computing power for automation and customization. However, programming is often prohibitively difficult to learn. Most computer programming languages and tools were designed around the needs and limitations of the computers executing code. This can lead to design features that are counterintuitive for the people who write code in those programming languages. My research focuses on creating programming tools that better match the ways that we naturally think and work. My goal is to reduce the learning curve required to program. It achieves this by proposing natural programming models that better match the ways non-programmers conceptualize programming concepts and by exploring ways to better support help-seeking while programming.</p> */}
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