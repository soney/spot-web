import * as React from 'react'
import { graphql } from 'gatsby';
import Link from 'gatsby-link'
import Image from 'gatsby-image';
import { StrapiAuthor } from '../../graphql-types';

interface MemberListDisplayProps {
    data: ReadonlyArray<StrapiAuthor>
}

export class MemberListDisplay extends React.Component<MemberListDisplayProps, {}> {
    constructor(props: MemberListDisplayProps, context: {}) {
        super(props, context)
    }
    public render() {
        const { data } = this.props;
        const memberDisplays = data.map((node: StrapiAuthor) => (
            <li key={node.id} className="column"><MemberDisplay data={node} /></li>
        ));
        return <ul className="columns is-mobile">
            {memberDisplays}
        </ul>;
    }
}

interface MemberDisplayProps {
    data: StrapiAuthor
}

class MemberDisplay extends React.Component<MemberDisplayProps, {}> {
    constructor(props: MemberDisplayProps, context: {}) {
        super(props, context);
    }
    public render() {
        const { data } = this.props;
        return <Link to={`/${data.given_name}_${data.family_name}`}>
                <Image className="is-rounded" fixed={data.headshot.childImageSharp.fixed as any} alt={`Headshot of ${data.given_name} ${data.family_name}`} />
                {`${data.given_name} ${data.family_name}`}
            </Link>;
    }
}