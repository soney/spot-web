import * as React from 'react'
import { PublicationListDisplay } from '../components/publications';
import { graphql } from 'gatsby';
import Link from 'gatsby-link'
import { Layout } from '../components/layout';

import { StrapiPublicationGroupConnection } from '../../graphql-types';

interface AboutPageProps { }

export default class extends React.Component<AboutPageProps, {}> {
    constructor(props: AboutPageProps, context: {}) {
        super(props, context);
    }
    public render() {
        return <Layout>
            We are the spot group
        </Layout>
    }
}