export default {
    USER_NOT_FOUND: () => {
        return {
            code: 1,
            message: `User not found`
        }
    },
    GROUP_NOT_FOUND: () => {
        return {
            code: 2,
            message: `group not found`
        }
    },
    MOVIE_NOT_FOUND: () => {
        return {
            code: 3,
            message: `movie not found`
        }
    },
    MOVIE_ALREADY_IN_GROUP: () => {
        return {
            code: 4,
            message: `Movie already in group`
        }
    },
    BAD_LIMIT: () => {
        return{
            code: 5,
            message: "Limit value must be of integer type or bellow 250"
        }
    },
    MORE_THAN_ONE_GROUP_WITH_NAME: groups => {
        let message = `More than one group with name ${groups[0].name}`
        for(let group in groups){
            message = message.concat(` ID: ${groups[group].id}`)
        }
        return{
            code:6,
            message: message
        }
    },
    INVALID_PARAMETER: argName => {
        return {
            code: 7,
            message: `Invalid argument ${argName}`
        }
    }
}

