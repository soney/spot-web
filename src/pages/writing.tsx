
import * as React from 'react'
import { Layout, SpotPage, LayoutHead } from '../components/layout';

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
    }
}

export const Head = LayoutHead('Writing');

export default class extends React.Component<IndexPageProps, {}> {
    constructor(props: IndexPageProps) {
        super(props);
    }
    public render() {
        const { data } = this.props;

        return <Layout active={SpotPage.writing}>
            <div className="container">
                <h2 className="">Writing</h2>
            </div>
        </Layout>;
    }
}