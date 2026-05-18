import React, { useEffect, useState } from 'react';

import { formatter } from '../utils/helper';

const Currency= ({
    value
}) => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if(!isMounted){
        return null;
    }

    return (
        <div className='font-semibold text-2xl'>
            {formatter.format(value)}
        </div>
  )
}

export default Currency