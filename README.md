# spot group website

This is the code repository for [the spot group website](http://from.so/). It uses [Gatsby](https://www.gatsbyjs.org/). It references [a custom CMS backend](https://github.com/soney/spot-web-cms) hosted at [http://141.211.133.47/](http://141.211.133.47).

# Cloning this repository
```text
git clone [repo_url]
cd spot-web
npm install .
```

# Updating the site
There are two kinds of updates you might want to make: **content** updates (more common) and **structure** updates (less common).

## Content Updates

To update the content of the group page, if you aren't already on the network, log into [the Michigan VPN](https://its.umich.edu/enterprise/wifi-networks/vpn) and visit [http://141.211.133.47/admin/auth/login](http://141.211.133.47/admin/auth/login). Then:

1. Run `git pull` and `npm install .` to be sure you have the latest version of this repo and its dependencies
2. Update the content
3. Test your changes by running `npm run develop` (note that you need to re-run this every time you change content)
4. When everything looks good, run `npm run deploy`
5. Double check [the group website](http://from.so/) to double check that everything still looks good. Note that it might take a minute for your changes to show up.

## Structure Updates

To update the **structure** of the group page (the actual code in this repository), if you aren't already on the network, log into [the Michigan VPN](https://its.umich.edu/enterprise/wifi-networks/vpn) so that [http://141.211.133.47](the CMS server) is accessible. Then:

1. Run `git pull` and `npm install .` to be sure you have the latest version of this repo and its dependencies
2. Run `npm run develop`
3. Make your changes
4. When everything looks good, run `npm run deploy`
5. Double check [the group website](http://from.so/) to double check that everything still looks good. Note that it might take a minute for your changes to show up.

# Important notes:

- Although the site has a custom domain (`from.so`), it is hosted on [Github Pages](https://pages.github.com/). The [`gh_pages` branch of this repository](https://github.com/soney/spot-web/tree/gh-pages) is the actual webpage
- This site does **not** dynamically reference the data from its [CMS backend](http://141.211.133.47). The CMS backend is **only** referenced when building the static pages (either `npm run build`, `npm run develop`, or `npm run deploy`).
- Every time you want to update the deployed website, you must [connect to the UMich VPN](https://its.umich.edu/enterprise/wifi-networks/vpn) and run `npm run deploy`
- Always be sure to pull the latest changes (`git pull`) before testing and deploying
