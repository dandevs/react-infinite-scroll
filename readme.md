# React Infinite Scroll
Up and down infinite scroll (todo: add left and right)
`npm i n-react-infinite-scroll`

## Props

| Prop | Type | Default | Description |
|:-|:-|:-|:-
|`handler`|`async (event) => any`||Called when scrollbar is beyond the threshold, will not load the same direction until it has a resolved. Should return a true or false value [?](#Handler)
|`useWindow`|`bool`|`false`| Use window or parent elements scroll bar |
|`threshold`|`number`|`100`| Distance before triggering handler
|`directions`|`Array<string>`|`["down"]`|Directions that will load, currently `up` and/or `down`


### Handler
Handler should return a value to indicate success of loading, indicating to reserve scroll height (`direction`: `up`)