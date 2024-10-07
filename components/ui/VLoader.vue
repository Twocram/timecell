<template>
    <div class="loader-container">
        <div class="lds-dual-ring"></div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.loader-container {
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.lds-dual-ring,
.lds-dual-ring:after {
    box-sizing: border-box;
}

.lds-dual-ring {
    display: inline-block;
    width: 48px;
    height: 48px;
}

.lds-dual-ring:after {
    content: " ";
    display: block;
    width: 48px;
    height: 48px;
    margin-top: 2px;
    border-radius: 50%;
    border: 3.4px solid currentColor;
    border-color: currentColor transparent currentColor transparent;
    animation: lds-dual-ring 1.2s linear infinite;
}

@keyframes lds-dual-ring {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
