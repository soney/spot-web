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
    allStrapiAuthor(filter: {type: {in: ["lead", "member"]}}, sort: {order: ASC, fields: [type, family_name]}) {
        nodes {
            id
            homepage
            given_name
            family_name
            type
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
            year
            media {
                id
                name
                artifact {
                    id
                    publicURL
                }
            }
            venue {
                short_name
                long_name
            }
            authors {
                id
                family_name
                given_name
            }
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
                    <PublicationList data={data.allStrapiPublication} />
                </div>
            )} />
        );
    }
}