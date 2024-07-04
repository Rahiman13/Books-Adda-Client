import React, { useState } from 'react';
import './gallery.css';

function HexagonImageGallery() {
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  const authors = {
    stanLee: {
      name: 'Stan Lee',
      info: 'Stan Lee was an American comic book writer, editor, publisher, and producer. He rose through the ranks of a family-run business to become Marvel Comics’ primary creative leader for two decades.',
    },
    georgeOrwell: {
      name: 'George Orwell',
      info: 'George Orwell was an English novelist, essayist, journalist and critic, known for his works Animal Farm and Nineteen Eighty-Four.',
    },
    jkRowling: {
      name: 'J.K. Rowling',
      info: 'J.K. Rowling is a British author, best known for writing the Harry Potter fantasy series.',
    },
    scottFitzgerald: {
      name: 'F. Scott Fitzgerald',
      info: 'F. Scott Fitzgerald was an American novelist, widely regarded as one of the greatest American writers of the 20th century.',
    },
    charlesDickens: {
      name: 'Charles Dickens',
      info: 'Charles Dickens was an English writer and social critic who created some of the world’s best-known fictional characters.',
    },
    janeAusten: {
      name: 'Jane Austen',
      info: 'Jane Austen was an English novelist known primarily for her six major novels, including Pride and Prejudice and Sense and Sensibility.',
    },
    ernestHemingway: {
      name: 'Ernest Hemingway',
      info: 'Ernest Hemingway was an American novelist, short-story writer, and journalist. His economical and understated style had a strong influence on 20th-century fiction.',
    },
  };

  const handleImageClick = (authorKey) => {
    setSelectedAuthor(authors[authorKey]);
  };

  const closeModal = () => {
    setSelectedAuthor(null);
  };

  return (
    <>
    <h1 className="text-4xl text-center mt-4 font-semibold ">Author's Gallery</h1>
      <div className="flex justify-center">
        <div className="hexagon-grid">
          <div className="hexagon center-image" onClick={() => handleImageClick('stanLee')}>
            <img
              src="https://media.gettyimages.com/id/615970090/photo/hollywood-ca-stan-lee-attends-the-premiere-of-disney-and-marvel-studios-doctor-strange-on.jpg?s=612x612&w=0&k=20&c=vdMgQD-OXG1y_z53Fb-3ky5TEoVdrZJRLmH37J6LZyA="
              alt="Stan Lee"
            />
          </div>
          <div className="hexagon side-image top-left" onClick={() => handleImageClick('georgeOrwell')}>
            <img
              src="https://media.gettyimages.com/id/1371458561/photo/eric-arthur-blair-better-known-by-his-pen-name-george-orwell-was-an-influential-english.jpg?s=612x612&w=0&k=20&c=OjBfseN1pFI1wG0_t0FbttCUUPP_RVcQ-knsoG6vBwQ="
              alt="George Orwell"
            />
          </div>
          <div className="hexagon side-image top-right" onClick={() => handleImageClick('jkRowling')}>
            <img
              src="https://media.gettyimages.com/id/1388460912/photo/london-england-j-k-rowling-attends-fantastic-beasts-the-secrets-of-dumbledore-world-premiere.jpg?s=612x612&w=0&k=20&c=wM6Wce4EgXSfixXOF1oSaPtJ-kWvhvWQAuq2FP35tQQ="
              alt="J.K. Rowling"
            />
          </div>
          <div className="hexagon side-image middle-left" onClick={() => handleImageClick('scottFitzgerald')}>
            <img
              src="https://media.gettyimages.com/id/3231209/photo/american-author-f-scott-fitzgerald-wearing-a-tweed-suit.jpg?s=612x612&w=0&k=20&c=JRC1R_AQYEYiwLEZ-d1A5xhqIfLcP7lI0CXHRDTpOaU="
              alt="F. Scott Fitzgerald"
            />
          </div>
          <div className="hexagon side-image middle-right" onClick={() => handleImageClick('charlesDickens')}>
            <img
              src="https://media.gettyimages.com/id/515218472/photo/photograph-of-charles-dickens-seated-undated-photograph.jpg?s=612x612&w=0&k=20&c=-RYsrXVlq3AIhaWfUVq-7fT0NUzDUURWJ4t1bloxN-k="
              alt="Charles Dickens"
            />
          </div>
          <div className="hexagon side-image bottom-left" onClick={() => handleImageClick('janeAusten')}>
            <img
              src="https://media.gettyimages.com/id/171072893/photo/jane-austen-portrait-of-the-english-novelist-as-a-young-woman-16-december-1775-18-july-1817.jpg?s=612x612&w=0&k=20&c=HufZI2X9rRm32oP9bubaRrqW9DcquT8N_FaS_Zq2Uso="
              alt="Jane Austen"
            />
          </div>
          <div className="hexagon side-image bottom-right" onClick={() => handleImageClick('ernestHemingway')}>
            <img
              src="https://media.gettyimages.com/id/145459445/photo/kenya-author-ernest-hemingway-poses-for-a-portrait-while-on-a-big-game-hunt-in-september-1952.jpg?s=612x612&w=0&k=20&c=yFhNVfq8KsnIygNpvncFzpXrc8PGafaQSC9FJK0kOYk="
              alt="Ernest Hemingway"
            />
          </div>
        </div>
        {selectedAuthor && (
          <div className="modal" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="close" onClick={closeModal}>&times;</span>
              <h2 className='text-center font-bold text-2xl mb-4'>{selectedAuthor.name}</h2>
              <p>{selectedAuthor.info}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default HexagonImageGallery;
