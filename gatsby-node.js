const axios = require('axios');

const NODE_TYPE = `Strapi_Menu`

exports.onPreInit = () => console.log("Loaded gatsby-source-strapi-menu")

exports.sourceNodes = async ({
  actions,
  createContentDigest,
  createNodeId,
},
  pluginOptions,
) => {

    const instance = axios.create({
        baseURL: pluginOptions.apiURL,
        timeout: 1000,
        headers: { Authorization: `Bearer ${pluginOptions.accessToken}`}
    });

    const { data } = await instance.get('/api/menus?nested&populate=*')
    .then(function (response) {
        return response.data
    })
    .catch(function (error) {
        console.log(error);
    });

    const { createNode } = actions

    data.forEach(menu =>
        createNode({
            ...menu,
            id: createNodeId(`${NODE_TYPE}-${menu.id}`),
            parent: null,
            children: [],
            internal: {
                type: NODE_TYPE,
                contentDigest: createContentDigest(menu),
            },
        })
    );

  return
}