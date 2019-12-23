import * as React from 'react'
import { PublicationListDisplay } from '../components/publications';
import { graphql } from 'gatsby';

import * as ReactMarkdown from 'react-markdown';

import Link from 'gatsby-link'
import Image from 'gatsby-image';
import { StrapiAuthor, StrapiPublication } from '../../graphql-types';
import { Layout } from '../components/layout';

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
            return <li key={l.id} className=""><a href={l.url} target='_blank'>{l.description}</a></li>
        });
        const pubsDisplay = <PublicationListDisplay data={pubs} groupByVenue={false} />
        return (
            <Layout>
                <section className="hero">
                    <div className="hero-body">
                        <div className="container">
                            <h1 className="title">{author.given_name} {author.family_name}</h1>
                            <h1 className="subtitle">{author.short_bio}</h1>
                        </div>
                    </div>
                </section>
                <div className="columns">
                    <div className="column is-one-quarter">
                        <Image fixed={author.headshot.childImageSharp.fixed as any} alt={`Headshot of ${author.given_name} ${author.family_name}`} />
                    </div>
                    <div className="column">
                        <p><ReactMarkdown source={author.long_bio} /></p>
                        <nav className="breadcrumb has-dot-separator" aria-label="breadcrumbs">
                            <ul className="">
                                <li className=""><a href={author.homepage} target='_blank'>Homepage</a></li>
                                {links}
                            </ul>
                        </nav>
                    </div>
                </div>
                <section>
                    <ul>{pubsDisplay}</ul>
                </section>
            </Layout>
        );
    }
}