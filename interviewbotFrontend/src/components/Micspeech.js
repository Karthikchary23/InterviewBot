// components/Micspeech.jsx
import React from 'react';
import styled from 'styled-components';

const Switch = ({ isChecked, onToggle }) => { // Receive isChecked and onToggle props
  return (
    <StyledWrapper>
      <div>
        <input
          type="checkbox"
          id="checkbox"
          checked={isChecked} 
          onChange={onToggle}  
        />
        <label className="switch" htmlFor="checkbox">
          <div className="mic-on">
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" className="bi bi-mic-fill" viewBox="0 0 16 16"> <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z" /> <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" /> </svg>
          </div>
          <div className="mic-off">
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" className="bi bi-mic-mute-fill" viewBox="0 0 16 16"> <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4.02 4.02 0 0 0 12 8V7a.5.5 0 0 1 1 0v1zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a4.973 4.973 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4zm3-9v4.879L5.158 2.037A3.001 3.001 0 0 1 11 3z" /> <path d="M9.486 10.607 5 6.12V8a3 3 0 0 0 4.486 2.607zm-7.84-9.253 12 12 .708-.708-12-12-.708.708z" /> </svg>
          </div>
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .switch {
    position: relative;
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(60,64,67);
    color: #fff;
    border-radius: 50%;
    cursor: pointer;
    transition: all .3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .mic-on, .mic-off {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all .3s ease-in-out;
  }

  .mic-on {
    z-index: 4;
  }

  .mic-off {
    position: absolute;
    inset: 0;
    z-index: 5;
    opacity: 0;
  }

  .switch:hover {
    background-color: rgba(60,64,67, 0.8);
  }

  #checkbox {
    display: none;
  }

  /* When checkbox is checked (mic is off/muted) */
  #checkbox:checked + .switch {
    background-color: red; /* Indicate "off" or muted state */
  }

  #checkbox:checked + .switch .mic-off {
    opacity: 1; /* Show mic-off icon */
  }

  #checkbox:active + .switch {
    scale: 1.2;
  }
`;

export default Switch;