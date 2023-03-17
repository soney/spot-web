
import * as React from 'react'
import { MemberListDisplay, MemberListLayout } from '../components/members';
import { graphql } from 'gatsby';
import { Layout, SpotPage } from '../components/layout';
import ReactMarkdown from 'react-markdown';

import { Strapi_AuthorGroupConnection, Strapi_Group } from '../../graphql-types';

// export const indexQuery = graphql`query news {
//     allStrapiNewsitems {
//         nodes {
//             id
//             date
//             description
//             relevant_people {
//                 id
//                 given_name
//                 family_name
//                 homepage
//                 use_local_homepage
//             }
//         }
//     }
// }`;

interface IndexPageProps {
    data: {
        allStrapiAuthor: Strapi_AuthorGroupConnection,
        strapiGroup: Strapi_Group
    }
}

export default class extends React.Component<IndexPageProps, {}> {
    constructor(props: IndexPageProps) {
        super(props);
    }
    public render() {
        const { data } = this.props;
        console.log(data);

        return <Layout active={SpotPage.writing}>
            <div className="container">
                <h2 className="">Writing</h2>
            </div>
        </Layout>;
    }
}