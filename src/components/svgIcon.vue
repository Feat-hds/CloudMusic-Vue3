<template>
<!-- svg图标组件 -->
    <svg :class="svgClass" aria-hidden="true">
        <use :xlink:href="iconName" />
    </svg>
</template>

<script>
    export default {
        name: "svgIcon",
        props: {
            iconClass: { //接受svg图片的名称，可选svg图在@/icons/svg内
                type: String,
                required: true,
            },
            className: { 
                type: String,
                default: '',
            },
        },
        computed: {
            iconName() {
                return `#icon-${this.iconClass}`
            },
            svgClass() {
                if (this.className) {
                    return 'svg-icon ' + this.className
                } else {
                    return 'svg-icon'
                }
            },
        }
    }
</script>

<style scoped>
    .svg-icon {
        width: 1em;
        height: 1em;
        fill: currentColor;
        overflow: hidden;
    }
</style>