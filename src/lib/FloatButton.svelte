<script>
  // @ts-nocheck
  export let href;
  export let img;
</script>

<a class="floating-btn" {href}>
  <img class="icon" src={img} alt="icon" />
</a>

<style>
  .floating-btn {
    display: flex;
    position: fixed;
    bottom: 20px;
    left: 20px; /* Adjust the left position according to your preference */
    /*background-color: burlywood;*/
    background-color: gold;
    color: white;
    border: none;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease-in-out;
    text-decoration: none; /* Add this to remove underline from the link */
  }
  .icon {
    filter: invert(100%);
    width: 50%;
    height: 50%;
  }
</style>
