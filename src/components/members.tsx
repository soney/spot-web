import * as React from 'react'
import { graphql } from 'gatsby';
import Link from 'gatsby-link'
import Image from 'gatsby-image';
import { StrapiAuthor } from '../../graphql-types';
import member from '../templates/member';

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
            <div key={node.id} className="col col-sm"><MemberDisplay data={node} /></div>
        ));
        return <div className="container">
            <div className="row">
                {memberDisplays}
            </div>
        </div>;
    }
}

interface MemberDisplayProps {
    data: StrapiAuthor
}

class MemberDisplay extends React.Component<MemberDisplayProps, {}> {
    constructor(props: MemberDisplayProps, context: {}) {
        super(props, context);
    }
    public render(): JSX.Element {
        const { data } = this.props;
        const memberContent: JSX.Element[] = [
            <Image className="member-headshot" fluid={data.headshot.childImageSharp.fluid as any} alt={`Headshot of ${data.given_name} ${data.family_name}`} />,
            <div className="member-name">{`${data.given_name} ${data.family_name}`}</div>,
            <div className="member-short-bio">{data.short_bio}</div>
        ]
        if(data.membership === 'lead') {
            return <Link className="member-display" to={`/${data.given_name}_${data.family_name}`}>{memberContent}</Link>;
        } else {
            return <a className="member-display" href={data.homepage} target="_blank">{memberContent}</a>;
        }
    }
}