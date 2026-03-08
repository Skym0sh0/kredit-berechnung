import {createRouter, createWebHistory} from "vue-router";
import KrediteOverview from "./components/KrediteOverview.vue";
import KreditDetails from "./components/KreditDetails.vue";

const routes = [
    {name: 'root', path: '/', component: KrediteOverview},
    {name: 'details', path: '/kredit/:anbieter/details/:title', props: true, component: KreditDetails},
    {path: '/:pathMatch(.+)', redirect: {name: 'root'}},
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})