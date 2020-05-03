<template>
  <div class="player_controller-hand"
       :class="{
            'player_controller-hand-on_turn': isTurn,
       }"
       ref="handWrapper">
    <template v-if="isMounted">
      <div v-for="(card, index) in sortedCards" :key="card.id"
           class="player_controller-card_wrapper"
           :class="{
                    'holding': selectedCard===index,
                    'dropping': selectedCard===index && isOnDropZone,
                  }"
           :style="index===selectedCard
                    ? calculateActiveCardTransform()
                    : calculateCardTransform(index, sortedCards.length)"
           @mousedown="onMouseDown"
           v-touch:start="onTouchStart"
           v-touch:moving="onTouchMoving"
           v-touch:end="onTouchEnd"
           @dragstart="preventEvent"
      >
        <Card v-bind="card"
              class="player_controller-card"
        />
      </div>
    </template>
  </div>
</template>
<script>
import Card from '@/components/Card.vue';
import sortCards from '@/scripts/sortCards';

export default {
  name: 'PlayerHand',
  components: { Card },
  props: ['cards', 'isTurn'],
  data() {
    return {
      isMounted: false,
      pointer: { x: 0, y: 0 },
      elem: { x: 0, y: 0 },
      selectedCard: -1,
      isOnDropZone: false,
    };
  },
  computed: {
    sortedCards() {
      return sortCards(this.cards);
    },
    handWrapperRef() {
      return this.$refs.handWrapper;
    },
  },
  methods: {
    preventEvent(event) {
      event.preventDefault();
    },
    calculateActiveCardTransform() {
      return {
        left: `${this.elem.x}px`,
        top: `${this.elem.y}px`,
      };
    },
    calculateCardTransform(index, total) {
      const fullWidth = (this.handWrapperRef ? this.handWrapperRef.clientWidth : 320) - 30;
      const degree = 30 / (total + 1);
      const rotate = (degree * index) - 15;
      const space = fullWidth / total > 30 ? 30 : fullWidth / total;
      const blank = (fullWidth - space * total) / 2;
      const left = 10 + blank + space * index - space / 2;
      const top = Math.abs(total / 2 - index) ** 2 * 0.5;
      return {
        transform: `rotate(${rotate}deg)`,
        left: `${left}px`,
        top: `${top}px`,
      };
    },
    setActiveElem(el) {
      this.selectedCard = [...this.handWrapperRef.children].indexOf(el);
      el.classList.add('holding');
      this.elem.x = el.getBoundingClientRect().x - this.handWrapperRef.getBoundingClientRect().x;
      this.elem.y = el.getBoundingClientRect().y - this.handWrapperRef.getBoundingClientRect().y;
    },
    onTouchStart(event) {
      this.pointer.x = event.touches[0].clientX;
      this.pointer.y = event.touches[0].clientY;
      this.setActiveElem(event.target);
    },
    onMouseDown(event) {
      this.pointer.x = event.clientX;
      this.pointer.y = event.clientY;
      this.setActiveElem(event.target);
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onTouchEnd);
    },
    onTouchEnd() {
      if (this.isOnDropZone) {
        this.handleCardMove();
      }
      this.selectedCard = -1;
      this.isOnDropZone = false;
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onTouchEnd);
    },
    onTouchMoving(event) {
      this.onMouseMove(event.touches[0]);
    },
    onMouseMove(event) {
      this.elem.x += (event.clientX - this.pointer.x);
      this.elem.y += (event.clientY - this.pointer.y);
      this.isOnDropZone = this.elem.y < -200;
      this.pointer.x = event.clientX;
      this.pointer.y = event.clientY;
    },
    handleCardMove() {
      if (this.selectedCard !== -1 && this.sortedCards[this.selectedCard]) {
        this.$emit('cardmove', this.sortedCards[this.selectedCard]);
      }
    },
  },
  mounted() {
    this.isMounted = true;
  },
};
</script>
<style lang="less">
  .player_controller-hand {
    position: absolute;
    bottom: 0;
    top: 0;
    left: 20px;
    right: 20px;
    user-select: none;
    &-on_turn:before {
      content: '';
      position: absolute;
      display: block;
      width: 100%;
      height: 1px;
      bottom: -30px;
      left: 0;
      right: 0;
      box-shadow: 0 -40px 50px 40px #188aff;
      pointer-events: none;
      border-radius: 50%;
      animation: color_gradiate infinite 5s;
    }
  }
  .player_controller-card_wrapper {
    width: 80px;
    position: absolute;
    left: 0;
    transform-origin: center center;
    &.holding {
      z-index: 2;
      width: 90px;
      box-shadow: 0 5px 30px rgba(0,0,0,.4);
    }
    &.dropping {
      z-index: 2;
      width: 90px;
      box-shadow: 0 0 50px 20px rgb(0, 111, 191);
    }
  }
  .player_controller-card {
    pointer-events: none;
  }
  @keyframes color_gradiate {
    from, to {
      box-shadow: 0 -40px 50px 40px #188aff;
    }
    50% {
      box-shadow: 0 -40px 10px 40px #ff1a71;
    }
  }
</style>
