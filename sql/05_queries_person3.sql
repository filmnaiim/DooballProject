-- Query 4: Subquery
SELECT 
    order_id,
    first_name,
    last_name,
    email,
    total_amount,
    bot_risk_score
FROM orders
WHERE total_amount > (
    SELECT AVG(total_amount) FROM orders
)
ORDER BY total_amount DESC;

-- Query 5: GROUP BY + MIN/MAX/AVG
SELECT 
    p.payment_method,
    COUNT(p.payment_id) AS total_transactions,
    MIN(o.total_amount) AS min_amount,
    MAX(o.total_amount) AS max_amount,
    ROUND(AVG(o.total_amount), 2) AS avg_amount
FROM payments p
JOIN orders o ON p.order_id = o.order_id
WHERE p.payment_status = 'SUCCESS'
GROUP BY p.payment_method;