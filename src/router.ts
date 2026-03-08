import {createMemoryHistory, createRouter} from "vue-router";
import KrediteOverview from "./components/KrediteOverview.vue";

const routes = [
    {path: '/', component: KrediteOverview},
    // { path: '/about', component: AboutView },
]

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
})