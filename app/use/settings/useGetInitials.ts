const getInitials = (name: string) => {
    const dayMatch = name.match(/^Day (\d) - /);
    if (dayMatch && dayMatch[1] >= '1' && dayMatch[1] <= '8') {
        return `D${dayMatch[1]}`;
    }
    return name.split(' ').map(word => word[0]).join('').substring(0, 3).toUpperCase();
};

export default getInitials;