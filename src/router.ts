import {createRouter, createWebHistory} from "vue-router";
import KrediteOverview from "./components/KrediteOverview.vue";
import KreditDetails from "./components/KreditDetails.vue";
import KrediteList from "./components/KrediteList.vue";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            name: 'root',
            path: '/',
            component: KrediteOverview,
            children: [
                {
                    name: 'overview',
                    path: '',
                    component: KrediteList,
                },
                {
                    name: 'details',
                    path: '/kredit/:anbieter/details/:title',
                    props: true,
                    component: KreditDetails
                },
            ]
        },
        {path: '/:pathMatch(.+)', redirect: {name: 'root'}},
    ],
})