import * as React from 'react'
import { PublicationListDisplay } from '../templates/publications';
import { graphql } from 'gatsby';

import * as ReactMarkdown from 'react-markdown';

import Link from 'gatsby-link'
import Image from 'gatsby-image';
import { StrapiAuthor, StrapiPublication } from '../../graphql-types';

export const memberQuery = graphql`query member($id: String!) {
    strapiAuthor(id: {eq: $id}) {
        id
        given_name
        family_name
        middle_name
        homepage
        short_bio
        long_bio
        membership
        links {
            id
            url
            description
        }
        headshot {
            childImageSharp {
                fixed(width: 200, height: 125) {
                    ...GatsbyImageSharpFixed
                }
            }
        }
    }
}`;

interface MemberProps {
    data: {
        strapiAuthor: StrapiAuthor,
    }
    pageContext: {
        pubs: ReadonlyArray<StrapiPublication>
    }
}

export default class extends React.Component<MemberProps, {}> {
    constructor(props: MemberProps, context: {}) {
        super(props, context);
    }
    public render() {
        const author = this.props.data.strapiAuthor;
        const pubs = this.props.pageContext.pubs;
        const links = author.links.map((l) => {
            return <li key={l.id}><a href={l.url} target='_blank'>{l.description}</a></li>
        });
        const pubsDisplay = <PublicationListDisplay limit={false} data={pubs} groupByVenue={false} />
        return (
            <div>
                <Link to='/'>(home)</Link>
                <h1>{author.given_name} {author.family_name}</h1>
                <Image fixed={author.headshot.childImageSharp.fixed as any} alt={`Headshot of ${author.given_name} ${author.family_name}`} />
                <a href={author.homepage} target='_blank'>Homepage</a>
                <ul>{links}</ul>
                <ReactMarkdown source={author.long_bio} />
                <ul>{pubsDisplay}</ul>
            </div>
        );
    }
}