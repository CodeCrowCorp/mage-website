# Coding Standards

## Naming Conventions

### General

Good: userId
Bad: user_id, user-id

### Writables and HTML components

Good: user_rule
Bad: userRole, user-role

### Query Params

Good: searchQuery
Bad: search_query, search-query

## Sveltekit specific requirements

### Forms

-use actions rather than on:submit or on:click events
-load data in server load function using streaming-with-promises and show skeleton layouts while loading

### Custom Stores

-should be used for data that is shared across multiple components
-not for api endpoints or utils
