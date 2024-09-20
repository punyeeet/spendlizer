import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { ImCross } from "react-icons/im";
import { IoIosArrowDropdown } from "react-icons/io";



const MultiSelectDropdown = ({ options, onChange, getKey, getLabel, placeholder, value }: any) => {

  const [selectedOptions, setSelectedOptions] = useState<any>(value ? [...value] : []);
  const [labels, setLabels] = useState<any>([]);

  const [showOptions, setShowOptions] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    console.log(value)
    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionToggle = (optionId: any, optionLabel: any) => {
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions(selectedOptions.filter((item: any) => (item) !== (optionId)));
      onChange(selectedOptions.filter((item: any) => (item) !== (optionId)));
    } else {
      setSelectedOptions([...selectedOptions, optionId]);
      onChange([...selectedOptions, optionId]);
    }

    if (labels.includes(optionLabel)) {
      setLabels(labels.filter((item: any) => (item) !== (optionLabel)));
    } else {
      setLabels([...labels, optionLabel]);
    }


  }

  const handleOptionsClick = () => {
    setShowOptions(!showOptions)
  }

  return (
    <>
      <div ref={ref} className='w-auto'>
        <div className="mt-1 w-full p-2 border rounded-md flex-row flex hover:cursor-pointer" onClick={handleOptionsClick}
          style={{
            borderColor: showOptions ? '#000':'inherit',
            borderWidth:2
          }}
        >
          <div className='w-3/4 flex flex-row flex-wrap' style={{scrollbarWidth:'thin'}}>

            {
              labels.length > 0 ?
                labels.map((option: any, index: number) => {
                  return (
                    <Fragment key={index}>
                      <div className='border rounded-lg m-1 w-auto' style={{ color: option.color }}>{option}</div>
                    </Fragment>
                  )
                }) : placeholder
            }
          </div>

          <span className='ml-auto text-xl'>{showOptions ? <>&times;</>: <IoIosArrowDropdown size={25} />}</span>

        </div>
        {
          showOptions ?
            <div className='border rounded-sm h-28 z-10 absolute bg-white shadow-md w-3/4 overflow-y-auto' style={{ scrollbarWidth: 'thin' }}>
              {
                options.map((option: any, index: number) => {

                  const selected = selectedOptions.includes(getKey(option));

                  return (
                    <div onClick={() => handleOptionToggle(getKey(option), getLabel(option))}
                      key={index}

                      style={selected ?
                        { backgroundColor: '#e2e8f0', color: option.color } : { color: option.color }}

                      className='flex flex-row justify-between hover:bg-gray-100 hover:cursor-pointer p-2'
                    >

                      {getLabel(option)} {selected ? <span><ImCross size={10} color='black' className='h-full align-middle' /></span> : null}

                    </div>
                  )
                })
              }

            </div> : null
        }
      </div>
    </>
  );
};

export default MultiSelectDropdown;
