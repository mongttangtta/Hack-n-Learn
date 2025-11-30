import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { learningTopics } from '../data/learningContent';
import { type ContentBlock, type InlineContent } from '../types/learning';
import HeroSection from '../components/HeroSection';
import Button from '../components/Button';
import CodeDisplay from '../components/CodeDisplay';
import WarningMessage from '../components/WarningMessage';

export default function LearningPageDetail() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const topic = topicId ? learningTopics[topicId] : undefined;

  const [openDetailTitle, setOpenDetailTitle] = useState<string | null>(null);

  const checklistBlock = topic?.content.find((b) => b.type === 'checklist');
  const checklistItemCount =
    checklistBlock && checklistBlock.type === 'checklist'
      ? checklistBlock.items.length
      : 0;

  const [checkedItems, setCheckedItems] = useState(
    new Array(checklistItemCount).fill(false)
  );

  const handleChecklistClick = (index: number) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
  };

  const handleToggleDetail = (title: string) => {
    setOpenDetailTitle(openDetailTitle === title ? null : title);
  };

  const renderInlineContent = (content: InlineContent[], keyPrefix: string) => {
    return content.map((item, index) => {
      if (typeof item === 'string') {
        const processedText = item
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(
            /`(.*?)`/g,
            '<code class="bg-code-bg text-code-keyword p-1 rounded">$1</code>'
          );
        return (
          <span
            key={`${keyPrefix}-${index}`}
            dangerouslySetInnerHTML={{ __html: processedText }}
          />
        );
      }
      switch (item.type) {
        case 'code':
          return (
            <code
              key={`${keyPrefix}-${index}`}
              className="bg-code-bg text-code-keyword p-1 rounded"
            >
              {item.text}
            </code>
          );
        default:
          return null;
      }
    });
  };

  const renderContentBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'h2':
        return (
          <h2 key={index} className="text-3xl font-bold mb-8">
            {block.text}
          </h2>
        );
      case 'h3':
        return (
          <h3 key={index} className="text-2xl font-bold mb-4 mt-12">
            {block.text}
          </h3>
        );
      case 'h4':
        return (
          <h4 key={index} className="text-xl font-bold mb-4">
            {block.text}
          </h4>
        );
      case 'p':
        return (
          <p key={index} className="mb-4 whitespace-pre-wrap">
            {renderInlineContent(block.content, `p-${index}`)}
          </p>
        );
      case 'ul':
        return (
          <ul key={index} className="list-disc list-inside mb-4 space-y-2">
            {block.items.map((item, i) => (
              <li key={i} className="whitespace-pre-wrap">
                {renderInlineContent(item, `ul-${index}-${i}`)}
              </li>
            ))}
          </ul>
        );
      case 'nested-list':
        return (
          <ul key={index} className="list-disc list-inside mb-4 space-y-2">
            {block.items.map((item, i) => (
              <li key={i} className="whitespace-pre-wrap">
                {renderInlineContent(item.content, `nested-list-${index}-${i}`)}
                {item.subItems && (
                  <ul className="list-decimal list-inside ml-8 mt-2 space-y-2">
                    {item.subItems.map((subItem, j) => (
                      <li key={j} className="whitespace-pre-wrap">
                        {renderInlineContent(
                          subItem,
                          `nested-list-${index}-${i}-${j}`
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        );
      case 'code':
        return <CodeDisplay key={index} code={block.text} language={block.language} className="mb-8" />;
      case 'image':
        return (
          <img
            key={index}
            src={block.src}
            alt={block.alt || ''}
            className="my-8 rounded-lg shadow-lg max-w-1/2 h-auto"
          />
        );
      case 'hr':
        return <hr key={index} className="border-edge my-16" />;
      case 'warning':
        return <WarningMessage key={index} message={block.message} />;
      case 'principle':
        return (
          <div key={index} className="flex items-center mb-8">
            <div className="h-8 w-1 bg-accent-primary1 mr-4"></div>
            <p className="text-lg font-bold">{block.text}</p>
          </div>
        );
      case 'grid': {
        const gridBlock = block; // To help typescript infer type
        const openItem = gridBlock.items.find(
          (item) => item.title === openDetailTitle
        );

        return (
          <div key={index}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {gridBlock.items.map((item, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-lg border-2 border-edge ${
                    item.isToggle ? 'cursor-pointer' : ''
                  } ${
                    item.title === openDetailTitle
                      ? 'bg-navigation'
                      : 'bg-card-background'
                  }`}
                  onClick={
                    item.isToggle
                      ? () => handleToggleDetail(item.title)
                      : undefined
                  }
                >
                  <h3 className="text-2xl font-bold text-primary-text mb-4">
                    {item.title}
                  </h3>
                  <p className="text-secondary-text mb-4">{item.text}</p>
                  <p className="font-bold">{item.footer}</p>
                </div>
              ))}
            </div>
            {openItem?.details && (
              <div className="mt-8 border-t-2 border-edge pt-8">
                <WarningMessage key="toggled-warning" />
                {openItem.details.map((detailBlock, detailIndex) =>
                  renderContentBlock(detailBlock, detailIndex)
                )}
              </div>
            )}
          </div>
        );
      }
      case 'checklist':
        return (
          <ul key={index} className="space-y-3">
            {block.items.map((item, i) => (
              <li
                key={i}
                className="flex items-start cursor-pointer"
                onClick={() => handleChecklistClick(i)}
              >
                <span
                  className={`mr-3 text-lg whitespace-pre ${
                    checkedItems[i]
                      ? 'text-accent-primary1'
                      : 'text-primary-text'
                  }`}
                >
                  [{checkedItems[i] ? '✔' : '   '}]
                </span>{' '}
                <span
                  className={
                    checkedItems[i]
                      ? 'text-secondary-text line-through'
                      : 'text-primary-text'
                  }
                >
                  {renderInlineContent(item, `checklist-${index}-${i}`)}
                </span>
              </li>
            ))}
          </ul>
        );
      case 'image-row':
        return (
          <div key={index} className="flex flex-wrap justify-center gap-4 my-8">
            {block.items.map((imageBlock, imageIndex) => (
              <img
                key={imageIndex}
                src={imageBlock.src}
                alt={imageBlock.alt || ''}
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  if (!topic) {
    return <div>Topic not found</div>;
  }

  return (
    <div className="min-h-screen text-primary-text">
      <HeroSection
        imageUrl={topic.imageUrl}
        title={topic.title}
        subtitle={topic.subtitle}
      />
      <div className="container mx-auto max-w-[1440px] px-20 py-16">
        {topic.content.map((block, index) => renderContentBlock(block, index))}
        <div className="text-center mt-16">
          <Button
            variant="primary"
            className="w-72 h-12 text-xl font-semibold rounded-[20px]"
            onClick={() => navigate(`/learning/quiz/${topic.id}`)}
          >
            퀴즈 풀러가기
          </Button>
        </div>
      </div>
    </div>
  );
}
