import { ref } from 'vue'

export function useRightClick() {
    const showRightClickWidget = ref(false)
    // 右键在网页中的位置
    const clickPosition = ref({})

    const onRightMouseUp = (e) => {
        const { clientX, clientY } = e
        clickPosition.value = { clientX, clientY }
        showRightClickWidget.value = true
    }

    return {
        showRightClickWidget,
        clickPosition,
        onRightMouseUp,
    }
}
