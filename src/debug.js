export function debugIntersections (rowMinY, intersections) {
    if (process.env.NODE_ENV !== 'development') return;
    const map = window.map;
    const l1 = L.circleMarker([rowMinY, intersections[0]], {
        color: 'green'
    }).addTo(map);
    const l2 = L.circleMarker([rowMinY, intersections[1]], {
        color: 'red'
    }).addTo(map);


    debugger

    l1.remove();
    l2.remove();
}
