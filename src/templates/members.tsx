import * as React from 'react'
import { graphql } from 'gatsby';
import Link from 'gatsby-link'
import Image from 'gatsby-image';

export default class extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context)
    }
    public render() {
        const { data } = this.props;
        const memberDisplays = data.nodes.map((node: any) => (
            <MemberDisplay key={node.id} data={node} />
        ));
        return <div>
            <ul>
                {memberDisplays}
            </ul>
        </div>;
    }
}

class MemberDisplay extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context)
    }
    public render() {
        const { data } = this.props;
        return <li>
            {/* <Link to={`/${data.id}`}> */}
            <a href={data.homepage} target='_blank'>
                <Image fixed={data.headshot.childImageSharp.fixed} />
                {`${data.given_name} ${data.family_name}`}
            </a>
            {/* </Link> */}
        </li>;
    }
}