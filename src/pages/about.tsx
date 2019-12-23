import * as React from 'react'
import { PublicationListDisplay } from '../components/publications';
import { graphql } from 'gatsby';
import Link from 'gatsby-link'
import { Layout } from '../components/layout';
import { MemberListDisplay } from '../components/members';

import { StrapiAuthorGroupConnection, StrapiPublicationGroupConnection } from '../../graphql-types';

export const aboutQuery = graphql`query allMembers {
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
                    fluid(maxWidth: 700) {
                        ...GatsbyImageSharpFluid_noBase64
                    }
                }
            }
        }
    }
}`;

interface AboutPageProps {
    data: {
        allStrapiAuthor: StrapiAuthorGroupConnection
    }
}

export default class extends React.Component<AboutPageProps, {}> {
    constructor(props: AboutPageProps, context: {}) {
        super(props, context);
    }
    public render() {
        const { data } = this.props;
        return <Layout>
            <div className="container">
                <h2>Mission</h2>
                <p></p>


                <h2 className="">People</h2>
                <MemberListDisplay data={data.allStrapiAuthor.nodes} />

                <h2>Apply</h2>
                <p>
                    We are always interested in working with 
                    If you are interested in doing research
                    <a href="https://www.si.umich.edu/programs/phd-information/admissions" target="_blank">Ph.D. Admissions</a>
                </p>
            </div>
        </Layout>
    }
}