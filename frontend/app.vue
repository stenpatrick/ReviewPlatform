<script>
export default {
    name: "DoctorsTable",
    props: {
        items: Array
    }
}
</script>

<template>
<table class="table table-striped">
    <thead class="table-dark">
    <tr>
        <th>Name</th>
        <th>Rating</th>
    </tr>
    </thead>
<tbody>
    <tr v-for="item in items">
        <td>{{item.name}}</td>
        <td>{{item.rating}}</td>
    </tr>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
</tbody>
</table>
</template>