import * as React from 'react'
import Members from '../templates/members';
import PublicationList from '../templates/publication_list';
import { StaticQuery, graphql } from 'gatsby';

import Link from 'gatsby-link'
import Image from 'gatsby-image';

import './index.scss'

// Please note that you can use https://github.com/dotansimha/graphql-code-generator
// to generate all types from graphQL schema
interface IndexPageProps {
    data: {
    }
}

const membersQuery = graphql`query membersAndLeads {
    allStrapiAuthor(filter: {membership: {in: ["lead", "member"]}}, sort: {fields: [membership, family_name], order: ASC}) {
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
                    fixed(width: 200, height: 125) {
                        ...GatsbyImageSharpFixed
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
            pub_details
            authors {
                id
                given_name
                family_name
                homepage
            }
            venue_year {
                id
                location
                venue
                year
                conference_start
                conference_end
            }
            pdf {
                publicURL
                childImageSharp {
                    fixed(width: 200, height: 125) {
                        ...GatsbyImageSharpFixed
                    }
                }
            }
        }
    }
    allStrapiVenue {
        nodes {
            id,
            strapiId
            long_name
            short_name
            type
        }
    }
}`;

// const publicationsQuery = graphql`query publications {
//     allStrapiAuthor(filter: {type: {in: ["lead", "member"]}}, sort: {order: ASC, fields: [type, family_name]}) {
//         nodes {
//             id
//             homepage
//             given_name
//             family_name
//             type
//             headshot {
//                 childImageSharp {
//                     fixed(width: 200, height: 125) {
//                         ...GatsbyImageSharpFixed
//                     }
//                 }
//             }
//         }
//     }
// }`;

export default class extends React.Component<IndexPageProps, {}> {
    constructor(props: IndexPageProps, context: any) {
        super(props, context);
    }
    public render() {
        return (
            <StaticQuery
                query={membersQuery}
                render={data => (
                <div className='container'>
                    <h1>spot group</h1>
                    <p>Welcome to the homepage of the spot group.</p>
                    <Members data={data.allStrapiAuthor} />
                    <PublicationList data={{publications: data.allStrapiPublication, venues: data.allStrapiVenue }} />
                </div>
            )} />
        );
    }
}